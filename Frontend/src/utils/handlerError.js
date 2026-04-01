export const atraparError = (error) => {
  let mensaje = "Error de conexión con el servidor.";

  if (error.response && error.response.data) {
    const data = error.response.data;

    // 1. Si Zod manda un array directo (tu error actual)
    if (Array.isArray(data)) {
      mensaje = data.map((e) => e.message || e.error).join(", ");
    }
    // 2. Si viene envuelto en { errors: [...] }
    else if (data.errors && Array.isArray(data.errors)) {
      mensaje = data.errors.map((e) => e.message).join(", ");
    }
    // 3. Si es un objeto genérico { message: "..." }
    else if (data.message || data.error || data.mensaje) {
      mensaje = data.message || data.error || data.mensaje;
    }
    // 4. Si es texto plano o JSON en string
    else if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed))
          mensaje = parsed.map((e) => e.message).join(", ");
        else if (parsed.message) mensaje = parsed.message;
        else mensaje = data;
      } catch (e) {
        mensaje = data;
      }
    }
  } else if (error.message) {
    mensaje = error.message;
  }

  // Filtro de seguridad para errores de Prisma gigantes
  if (mensaje.includes("Invalid `prisma")) {
    mensaje =
      "Error interno: Formato de datos incorrecto para la base de datos.";
  } else if (mensaje.length > 150) {
    mensaje = mensaje.substring(0, 150) + "...";
  }

  throw new Error(mensaje);
};