export const atraparError = (error) => {
  let mensajeError = "Error de conexión con el servidor.";

  if (error.response?.data) {
    const data = error.response.data;

    try {
      const parsedData = typeof data === "string" ? JSON.parse(data) : data;

      if (
        Array.isArray(parsedData) &&
        parsedData.length > 0 &&
        parsedData[0].message
      ) {
        mensajeError = parsedData[0].message;
      } else if (
        parsedData.errors &&
        Array.isArray(parsedData.errors) &&
        parsedData.errors.length > 0
      ) {
        mensajeError = parsedData.errors[0].message;
      } else if (parsedData.error || parsedData.mensaje || parsedData.message) {
        mensajeError =
          parsedData.error || parsedData.mensaje || parsedData.message;
      }
    } catch (e) {
      // Si falla el parseo a JSON, asumimos que es texto plano
      mensajeError =
        typeof data === "string" ? data : "Error al procesar la solicitud.";
    }
  } else if (error.message) {
    mensajeError = error.message;
  }

  // 👉 EL DOMADOR DE PRISMA: Si el mensaje es gigante o habla de Prisma, lo achicamos
  if (typeof mensajeError === "string") {
    if (mensajeError.includes("Invalid `prisma")) {
      mensajeError =
        "Error en base de datos: Verifica que todos los campos sean correctos.";
    } else if (mensajeError.length > 100) {
      // Si sigue siendo muy largo, lo cortamos para no romper el Toast
      mensajeError = mensajeError.substring(0, 100) + "...";
    }
  }

  throw new Error(mensajeError);
};
