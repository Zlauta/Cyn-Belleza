import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ResumenReserva = ({
  servicio,
  fecha,
  hora,
  onConfirmar,
  onCancelar,
  cargando,
}) => {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nombre.trim().length < 3) {
      return toast.error("Por favor, ingresá tu nombre completo.");
    }

    // Validamos que el teléfono tenga entre 8 y 15 dígitos y sean solo números
    const telRegex = /^\d{8,15}$/;
    if (!telRegex.test(telefono)) {
      return toast.error(
        "Ingresá un número de WhatsApp válido (solo números).",
      );
    }

    onConfirmar({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="bg-pink-50 border border-pink-100 p-6 md:p-8 rounded-3xl mt-12 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-6">
        <CheckCircle className="text-pink-600 w-6 h-6" />
        <h3 className="text-2xl font-bold text-gray-900">
          Confirma tu Reserva
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6 bg-white p-4 rounded-2xl">
        <div>
          <p className="text-xs text-pink-600 font-bold uppercase tracking-wider mb-1">
            Servicio
          </p>
          <p className="text-lg font-bold text-gray-900">{servicio.nombre}</p>
          <p className="text-gray-600 font-medium">
            ${servicio.precio.toLocaleString("es-AR")}
          </p>
        </div>
        <div>
          <p className="text-xs text-pink-600 font-bold uppercase tracking-wider mb-1">
            Fecha y Hora
          </p>
          <p className="text-lg font-bold text-gray-900 capitalize">
            {format(fecha, "EEEE, d 'de' MMMM", { locale: es })}
          </p>
          <p className="text-gray-600 font-medium">{hora} hs</p>
        </div>
      </div>

      {/* 👉 FORMULARIO DEL CLIENTE */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Tu Nombre y Apellido
          </label>
          <input
            type="text"
            required
            minLength={3}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: María Gómez"
            className="w-full px-4 py-3 border border-pink-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Tu WhatsApp
          </label>
          <input
            type="tel"
            required
            pattern="[0-9]*" // Sugiere teclado numérico en celulares
            value={telefono}
            onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))} // Limpia letras al escribir
            placeholder="Ej: 3811234567"
            className="w-full px-4 py-3 border border-pink-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={cargando}
            className="flex-1 bg-pink-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-pink-700 disabled:opacity-50 transition-all"
          >
            {cargando ? "PROCESANDO..." : "CONFIRMAR RESERVA"}
          </button>
          <button
            type="button"
            onClick={onCancelar}
            disabled={cargando}
            className="sm:w-1/3 bg-white border-2 border-pink-200 text-pink-600 py-4 rounded-xl font-bold text-lg hover:bg-pink-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ResumenReserva;
