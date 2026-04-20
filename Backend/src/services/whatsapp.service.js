import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import cron from "node-cron";
import { prisma } from "../db.js";
import qrcode from "qrcode";

// Bandera para saber si el bot está 100% operativo
export let botListo = false; // 👉 La exportamos por si alguna vez querés ver el estado desde otro lado
export let qrActualTexto = null;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-zygote",
      "--single-process",
      "--disable-accelerated-2d-canvas",
      "--disable-software-rasterizer",
      "--mute-audio",
      "--disable-extensions",
      // 👉 DIETA EXTREMA (Nuevos ahorros de memoria)
      "--disable-features=site-per-process", // Ahorra RAM aislando procesos de iframes
      "--blink-settings=imagesEnabled=false", // IMPIDE descargar fotos de perfil o estados de WA (Ahorro gigante)
      "--disable-dev-tools", // Apaga las herramientas de desarrollador internas de Chrome
    ],
  },
  authTimeoutMs: 180000,
});

client.on("qr", (qr) => {
  console.log("⚠️ Nuevo código QR generado. Entrá a la ruta para escanearlo.");
  qrActualTexto = qr;
});

client.on("ready", () => {
  console.log("✅ Bot de WhatsApp listo y en línea!");
  qrActualTexto = null;
  botListo = true; // 👉 ¡CORRECCIÓN CRÍTICA! Si no poníamos esto, nunca iba a mandar mensajes
});

client.on("disconnected", (reason) => {
  botListo = false;
  console.log("❌ El bot de WhatsApp se desconectó. Razón:", reason);
});

client.initialize().catch((error) => {
  console.error("❌ Error crítico inicializando WhatsApp:", error.message);
  console.log(
    "⚠️ El servidor seguirá funcionando, pero el bot de WhatsApp está apagado.",
  );
});

// Función de espera para no saturar a WhatsApp si entran muchos turnos de golpe
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const enviarNotificacionTurno = async (turno) => {
  if (!botListo) {
    console.log(
      "⚠️ Intento de envío cancelado: El bot de WhatsApp no está listo.",
    );
    return;
  }

  try {
    const fecha = new Date(turno.fechaHora).toLocaleDateString("es-AR");
    const hora = new Date(turno.fechaHora).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const nombreServicio = turno.servicio?.nombre || "Tratamiento";

    // 1. Notificar a Cynthia
    const numeroCyn = process.env.NUMERO_CYN_BELLEZA;
    const msjCyn =
      `📢 *Nuevo Turno Web*\n\n` +
      `👤 Cliente: ${turno.clienteManual || turno.cliente?.nombre}\n` +
      `✨ Servicio: ${nombreServicio}\n` +
      `📅 Fecha: ${fecha}\n` +
      `⏰ Hora: ${hora}\n\n` +
      `_Revisalo en tu panel de administración._`;

    await client.sendMessage(numeroCyn, msjCyn);

    await esperar(2000); // Pausa anti-spam

    // 2. Notificar a la Clienta
    let telefonoCliente = turno.cliente?.telefono;

    if (
      !telefonoCliente &&
      turno.clienteManual &&
      turno.clienteManual.includes("Tel: ")
    ) {
      telefonoCliente = turno.clienteManual.split("Tel: ")[1].trim();
    }

    if (telefonoCliente) {
      let numeroLimpio = telefonoCliente.toString().replace(/\D/g, "");

      if (numeroLimpio.startsWith("0"))
        numeroLimpio = numeroLimpio.substring(1);
      if (numeroLimpio.includes("15") && numeroLimpio.length > 10) {
        numeroLimpio = numeroLimpio.replace("15", "");
      }

      const jidCliente = `549${numeroLimpio}@c.us`;
      const aliasMP = process.env.ALIAS_CYN_BELLEZA;

      const msjCliente =
        `¡Hola! ✨ Gracias por elegir *CYN Belleza*.\n\n` +
        `Hemos pre-agendado tu turno para *${nombreServicio}*:\n` +
        `📅 Fecha: ${fecha}\n` +
        `⏰ Hora: ${hora}\n\n` +
        `⚠️ *IMPORTANTE PARA CONFIRMAR:*\n` +
        `Para asegurar tu lugar, necesitamos una seña del *20%* de lo que cuesta el servicio. Por favor, transferí al siguiente alias de Mercado Pago / Ualá:\n\n` +
        `💸 *Alias:* ${aliasMP}\n\n` +
        `📝 *Nuestra Política de Turnos:*\n` +
        `Sabemos que pueden surgir imprevistos. Podés reprogramar o cancelar tu turno sin perder tu seña avisándonos con al menos *24 horas de anticipación*. Las cancelaciones con menos de 24 hs no tienen devolución de seña, para poder respetar el tiempo de nuestras profesionales.\n\n` +
        `Una vez que transfieras, *respondé a este mensaje enviando el comprobante* para que tu turno quede 100% confirmado ✅.\n\n` +
        `¡Muchas gracias! Te esperamos.`;

      await client.sendMessage(jidCliente, msjCliente);
      console.log("✅ Mensaje enviado al cliente correctamente.");
    } else {
      console.log(
        "⚠️ No se encontró el teléfono del cliente, no se envió mensaje.",
      );
    }
  } catch (error) {
    console.error("❌ Error enviando mensaje de WhatsApp:", error.message);
  }
};

const enviarRecordatoriosProgramados = async () => {
  if (!botListo) return;

  console.log("⏰ Revisando turnos para enviar recordatorios...");

  try {
    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);

    const inicioMañana = new Date(mañana.setHours(0, 0, 0, 0));
    const finMañana = new Date(mañana.setHours(23, 59, 59, 999));

    const turnosDeMañana = await prisma.turno.findMany({
      where: {
        fechaHora: {
          gte: inicioMañana,
          lte: finMañana,
        },
        estado: { not: "CANCELADO" },
        recordatorioEnviado: false,
      },
      include: { servicio: true },
    });

    for (const turno of turnosDeMañana) {
      let telefonoCliente = "";
      if (turno.clienteManual && turno.clienteManual.includes("Tel: ")) {
        telefonoCliente = turno.clienteManual.split("Tel: ")[1].trim();
      }

      if (telefonoCliente) {
        const numeroLimpio = telefonoCliente.replace(/\D/g, "");
        const jidCliente = `549${numeroLimpio}@c.us`;
        const hora = new Date(turno.fechaHora).toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const msjRecordatorio =
          `¡Hola! ✨ Te recordamos tu turno de mañana en *CYN Belleza*:\n\n` +
          `💆‍♀️ *${turno.servicio.nombre}*\n` +
          `⏰ A las ${hora} hs.\n\n` +
          `📍 ¡Te esperamos! (Si no podés asistir, por favor avisanos con tiempo).`;

        await client.sendMessage(jidCliente, msjRecordatorio);

        await prisma.turno.update({
          where: { id: turno.id },
          data: { recordatorioEnviado: true },
        });

        await esperar(3000);
      }
    }
    if (turnosDeMañana.length > 0)
      console.log(`✅ Se enviaron ${turnosDeMañana.length} recordatorios.`);
  } catch (error) {
    console.error("❌ Error en el cron de recordatorios:", error);
  }
};

cron.schedule("0 9,18 * * *", () => {
  enviarRecordatoriosProgramados();
});

export const enviarAlertaCancelacionAdmin = async (turnoCancelado) => {
  if (!botListo) return; // 👉 Agregamos el chequeo acá también por las dudas

  try {
    const fecha = new Date(turnoCancelado.fechaHora);
    const fechaStr = fecha.toLocaleDateString("es-AR");
    const horaStr = fecha.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const nombreCliente =
      turnoCancelado.cliente?.nombre ||
      turnoCancelado.clienteManual ||
      "Una clienta";
    const nombreServicio = turnoCancelado.servicio?.nombre || "un servicio";

    const mensaje = `⚠️ *TURNO CANCELADO* ⚠️\n\nHola Cyn, la clienta *${nombreCliente}* acaba de cancelar su turno desde la página web.\n\n✂️ *Servicio:* ${nombreServicio}\n📅 *Día:* ${fechaStr}\n⏰ *Hora:* ${horaStr} hs\n\n💰 _Recordá revisar tu cuenta de Uala o contactarla para la devolución de la seña._`;

    const numeroCyn = process.env.NUMERO_CYN_BELLEZA;

    await client.sendMessage(numeroCyn, mensaje);
  } catch (error) {
    console.error(
      "No se pudo enviar el aviso de cancelación a Cyn:",
      error.message,
    );
  }
};
