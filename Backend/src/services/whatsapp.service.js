import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";
import cron from "node-cron";
import { prisma } from "../db.js"; // 👉 AGREGÁ ESTA LÍNEA

// Bandera para saber si el bot está 100% operativo
let botListo = false;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    // 🔥 Estos argumentos evitan que Chrome colapse por falta de memoria
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
    ],
  },
  // 🔥 ESTA ES LA MAGIA: Evita que WhatsApp Web se recargue solo y tire el "Detached Frame"
  webVersionCache: {
    type: "none",
    strict: true,
  },
});

client.on("qr", (qr) => {
  console.log("📱 ¡ATENCIÓN! ESCANEÁ ESTE QR CON EL WHATSAPP DEL SALÓN:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  botListo = true;
  console.log("✅ ¡Bot de WhatsApp de CYN Belleza está conectado y listo!");
});

client.on("disconnected", (reason) => {
  botListo = false;
  console.log("❌ El bot de WhatsApp se desconectó. Razón:", reason);
});

client.initialize();

// Función de espera para no saturar a WhatsApp si entran muchos turnos de golpe
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const enviarNotificacionTurno = async (turno) => {
  // Si el bot no está listo, cancelamos el envío para que no crashee el servidor
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
    const numeroCyn = process.env.NUMERO_CYN_BELLEZA; // 👉 ACORDATE DE PONER EL NÚMERO REAL ACÁ
    const msjCyn =
      `📢 *Nuevo Turno Web*\n\n` +
      `👤 Cliente: ${turno.clienteManual || turno.cliente?.nombre}\n` +
      `✨ Servicio: ${nombreServicio}\n` +
      `📅 Fecha: ${fecha}\n` +
      `⏰ Hora: ${hora}\n\n` +
      `_Revisalo en tu panel de administración._`;

    await client.sendMessage(numeroCyn, msjCyn);

    // Esperamos 2 segundos entre mensaje y mensaje para no ser detectados como SPAM
    await esperar(2000);

    // 2. Notificar a la Clienta
    let telefonoCliente = "";

    if (turno.clienteManual && turno.clienteManual.includes("Tel: ")) {
      telefonoCliente = turno.clienteManual.split("Tel: ")[1].trim();
    }

    if (telefonoCliente) {
      const numeroLimpio = telefonoCliente.replace(/\D/g, "");
      const jidCliente = `549${numeroLimpio}@c.us`;

      const aliasMP = process.env.ALIAS_CYN_BELLEZA;

      const msjCliente =
        `¡Hola! ✨ Gracias por elegir *CYN Belleza*.\n\n` +
        `Hemos pre-agendado tu turno para *${nombreServicio}*:\n` +
        `📅 Fecha: ${fecha}\n` +
        `⏰ Hora: ${hora}\n\n` +
        `⚠️ *IMPORTANTE PARA CONFIRMAR:*\n` +
        `Para asegurar tu lugar, necesitamos una seña del *20%*. Por favor, transferí al siguiente alias de Mercado Pago:\n\n` +
        `💸 *Alias:* ${aliasMP}\n\n` +
        `📝 *Nuestra Política de Turnos:*\n` +
        `Sabemos que pueden surgir imprevistos. Podés reprogramar o cancelar tu turno sin perder tu seña avisándonos con al menos *24 horas de anticipación*. Las cancelaciones con menos de 24 hs no tienen devolución de seña, para poder respetar el tiempo de nuestras profesionales.\n\n` +
        `Una vez que transfieras, *respondé a este mensaje enviando el comprobante* para que tu turno quede 100% confirmado ✅.\n\n` +
        `¡Muchas gracias! Te esperamos.`;

      await client.sendMessage(jidCliente, msjCliente);
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

    // Buscamos turnos de mañana que no hayan sido notificados y no estén cancelados
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

        // Marcamos como enviado para no repetir
        await prisma.turno.update({
          where: { id: turno.id },
          data: { recordatorioEnviado: true },
        });

        await esperar(3000); // Pausa de 3 segundos para seguridad
      }
    }
    if (turnosDeMañana.length > 0)
      console.log(`✅ Se enviaron ${turnosDeMañana.length} recordatorios.`);
  } catch (error) {
    console.error("❌ Error en el cron de recordatorios:", error);
  }
};

// PROGRAMACIÓN (CRON):
// Se ejecuta todos los días a las 09:00 AM y a las 18:00 PM
// Formato: (minuto hora día mes día-semana)
cron.schedule("0 9,18 * * *", () => {
  enviarRecordatoriosProgramados();
});
