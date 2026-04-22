import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import { prisma } from "../db.js";
import cron from "node-cron";
import { execSync } from "child_process"; // 👉 Importamos el ejecutor de comandos de Linux

export let botListo = false;
export let qrActualTexto = null;

// 👉 LIMPIEZA BRUTAL: Borra cualquier candado en la carpeta principal o en Default
try {
  execSync("rm -f .wwebjs_auth/session/Singleton*");
  execSync("rm -f .wwebjs_auth/session/Default/Singleton*");
  console.log("🧹 Limpieza de candados completada por consola Linux.");
} catch (e) {
  // Si tira error es porque no existían, así que no hacemos nada
}

// 👉 MODO BESTIA (RAILWAY): Libre de restricciones de memoria
const client = new Client({
  authStrategy: new LocalAuth(), 
  puppeteer: {
    executablePath: "/usr/bin/chromium-browser",
    headless: true,
    protocolTimeout: 300000, 
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--blink-settings=imagesEnabled=false",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-zygote"
    ],
  },
  authTimeoutMs: 180000,
  // 👉 EL ESCUDO: Obliga a WhatsApp a usar una versión compatible que no congela a Chromium
  webVersionCache: {
    type: "remote",
    remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
});

client.on("qr", (qr) => {
  console.log("⚠️ Nuevo QR generado. Entrá a /api/bot/qr para escanearlo.");
  qrActualTexto = qr;
});

client.on("ready", () => {
  console.log(
    "✅ Bot de WhatsApp listo, persistente y con memoria de sobra en Railway!",
  );
  qrActualTexto = null;
  botListo = true;
});

client.on("disconnected", (reason) => {
  botListo = false;
  console.log("❌ Bot desconectado:", reason);
});

client.initialize().catch((error) => {
  console.error("❌ Error inicializando:", error.message);
});

// --- FUNCIONES DE ENVÍO ---
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const enviarNotificacionTurno = async (turno) => {
  if (!botListo) return;

  try {
    const fecha = new Date(turno.fechaHora).toLocaleDateString("es-AR");
    const hora = new Date(turno.fechaHora).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const nombreServicio = turno.servicio?.nombre || "Tratamiento";
    const numeroCyn = process.env.NUMERO_CYN_BELLEZA;

    const msjCyn =
      `📢 *Nuevo Turno Web*\n\n` +
      `👤 Cliente: ${turno.clienteManual || turno.cliente?.nombre}\n` +
      `✨ Servicio: ${nombreServicio}\n` +
      `📅 Fecha: ${fecha}\n` +
      `⏰ Hora: ${hora}\n\n` +
      `_Revisalo en tu panel de administración._`;

    await client.sendMessage(numeroCyn, msjCyn);
    await esperar(2000);

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

      // 👉 BUG ARREGLADO ACÁ ABAJO (Estaba mal concatenado el texto)
      const msjCliente =
        `¡Hola! ✨ Gracias por elegir *CYN Belleza*.\n\n` +
        `Hemos pre-agendado tu turno para *${nombreServicio}*:\n` +
        `📅 Fecha: ${fecha}\n` +
        `⏰ Hora: ${hora}\n\n` +
        `⚠️ *IMPORTANTE PARA CONFIRMAR:*\n` +
        `Para asegurar tu lugar, necesitamos una seña del *20%* de lo que cuesta el servicio. Por favor, transferí al siguiente alias:\n\n` +
        `💸 *Alias:* ${aliasMP}\n\n` +
        `📝 *Nuestra Política de Turnos:*\n` +
        `Podés reprogramar o cancelar sin perder tu seña avisándonos con al menos *24 horas de anticipación*.\n\n` +
        `Una vez que transfieras, *respondé a este mensaje enviando el comprobante* para que tu turno quede 100% confirmado ✅.\n\n` +
        `Desde ya muchas gracias por elegirnos, ¡te esperamos para que disfrutes de tu experiencia de belleza! 🌸`;

      await client.sendMessage(jidCliente, msjCliente);
    }
  } catch (error) {
    console.error("❌ Error enviando mensaje de WhatsApp:", error.message);
  }
};

const enviarRecordatoriosProgramados = async () => {
  if (!botListo) return;
  try {
    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);
    const inicioMañana = new Date(mañana.setHours(0, 0, 0, 0));
    const finMañana = new Date(mañana.setHours(23, 59, 59, 999));

    const turnosDeMañana = await prisma.turno.findMany({
      where: {
        fechaHora: { gte: inicioMañana, lte: finMañana },
        estado: { not: "CANCELADO" },
        recordatorioEnviado: false,
      },
      include: { servicio: true },
    });

    for (const turno of turnosDeMañana) {
      let telefonoCliente = "";
      if (turno.clienteManual && turno.clienteManual.includes("Tel: ")) {
        telefonoCliente = turno.clienteManual.split("Tel: ")[1].trim();
      } else if (turno.cliente?.telefono) {
        telefonoCliente = turno.cliente.telefono;
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
          `📍 ¡Te esperamos!`;

        await client.sendMessage(jidCliente, msjRecordatorio);

        await prisma.turno.update({
          where: { id: turno.id },
          data: { recordatorioEnviado: true },
        });

        await esperar(3000);
      }
    }
  } catch (error) {
    console.error("❌ Error en el cron de recordatorios:", error);
  }
};

cron.schedule("0 9,18 * * *", () => {
  enviarRecordatoriosProgramados();
});

export const enviarAlertaCancelacionAdmin = async (turnoCancelado) => {
  if (!botListo) return;

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

    const mensaje = `⚠️ *TURNO CANCELADO* ⚠️\n\nHola Cyn, la clienta *${nombreCliente}* acaba de cancelar su turno web.\n\n✂️ *Servicio:* ${nombreServicio}\n📅 *Día:* ${fechaStr}\n⏰ *Hora:* ${horaStr} hs`;

    const numeroCyn = process.env.NUMERO_CYN_BELLEZA;
    await client.sendMessage(numeroCyn, mensaje);
  } catch (error) {
    console.error("No se pudo enviar aviso de cancelación:", error.message);
  }
};
