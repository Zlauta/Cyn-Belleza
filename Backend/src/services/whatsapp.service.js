import pkg from "whatsapp-web.js";
const { Client, RemoteAuth } = pkg;
import { prisma } from "../db.js";
import cron from "node-cron";
import fs from "fs";
import path from "path";

// --- 🛠️ ADAPTADOR DE PRISMA PERSONALIZADO ---
class PrismaStore {
    async sessionExists(options) {
        const session = await prisma.whatsappSession.findUnique({
            where: { id: options.session }
        });
        return !!session;
    }

    async save(options) {
        // RemoteAuth crea un zip en .wwebjs_auth/session-clientId.zip
        const filePath = path.join(process.cwd(), `.wwebjs_auth/session-${options.session}.zip`);
        const sessionData = fs.readFileSync(filePath);
        
        await prisma.whatsappSession.upsert({
            where: { id: options.session },
            update: { data: sessionData },
            create: { id: options.session, data: sessionData }
        });
    }

    async extract(options) {
        const session = await prisma.whatsappSession.findUnique({
            where: { id: options.session }
        });
        if (!session) return;

        const authDir = path.join(process.cwd(), '.wwebjs_auth');
        if (!fs.existsSync(authDir)) fs.mkdirSync(authDir);

        const filePath = path.join(authDir, `session-${options.session}.zip`);
        fs.writeFileSync(filePath, session.data);
    }

    async delete(options) {
        await prisma.whatsappSession.delete({
            where: { id: options.session }
        }).catch(() => {}); // Ignorar si no existe
    }
}

// --- 🚀 CONFIGURACIÓN DEL CLIENTE ---
export let botListo = false;
export let qrActualTexto = null;

// 👉 CONFIGURACIÓN CON BROWSERLESS
const client = new Client({
    authStrategy: new RemoteAuth({
        clientId: "cyn-belleza-prod",
        store: new PrismaStore(),
        backupSyncIntervalMs: 300000 // Sincroniza con la DB cada 5 minutos
    }),
    puppeteer: {
        // 👇 Chau Browserless, usamos el navegador enano de Alpine
        executablePath: '/usr/bin/chromium-browser',
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage", // Salva la memoria en Render
            "--disable-gpu",
            "--disable-extensions"
        ],
    },
    authTimeoutMs: 180000,
});

// Evento especial: se dispara cuando la sesión ya viajó a la DB de Neon
client.on("remote_session_saved", () => {
    console.log("✨ ¡Sesión persistida en PostgreSQL exitosamente!");
});

client.on("qr", (qr) => {
    console.log("⚠️ Nuevo QR generado. Escanealo para guardarlo en la DB.");
    qrActualTexto = qr;
});

client.on("ready", () => {
    console.log("✅ Bot de WhatsApp listo y persistente en la nube.");
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

// --- EL RESTO DE TUS FUNCIONES (enviarNotificacionTurno, etc.) SIGUEN IGUAL ---

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
        `Una vez que transfieras, *respondé a este mensaje enviando el comprobante* para que tu turno quede 100% confirmado ✅.`;

      await client.sendMessage(jidCliente, msjCliente);
      console.log("✅ Mensaje enviado al cliente correctamente.");
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
    console.error(
      "No se pudo enviar el aviso de cancelación a Cyn:",
      error.message,
    );
  }
};
