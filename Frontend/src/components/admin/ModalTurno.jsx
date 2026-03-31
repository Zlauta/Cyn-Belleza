import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { format, addMonths } from "date-fns"; // 👉 Usamos date-fns para calcular los límites

const ModalTurno = ({ abierto, cerrar, turnoAEditar, onSubmitForm }) => {
  const { register, handleSubmit, reset } = useForm();

  // 🗓️ LÓGICA DE LÍMITES DE FECHA
  const hoyStr = format(new Date(), "yyyy-MM-dd"); // Fecha mínima (hoy)
  const maxMeseStr = format(addMonths(new Date(), 1), "yyyy-MM-dd"); // Fecha máxima (hoy + 1 mes)

  useEffect(() => {
    if (turnoAEditar) {
      // Si editamos, formateamos la fecha para que el input type="date" la entienda
      const fechaFormateada =
        typeof turnoAEditar.fecha === "string"
          ? turnoAEditar.fecha.split("T")[0]
          : format(new Date(turnoAEditar.fecha), "yyyy-MM-dd");

      reset({ ...turnoAEditar, fecha: fechaFormateada });
    } else {
      reset({
        cliente: "",
        servicio: "",
        profesional: "",
        fecha: hoyStr,
        hora: "10:00",
        estado: "PENDIENTE",
      });
    }
  }, [turnoAEditar, abierto, reset, hoyStr]);

  return (
    <AnimatePresence>
      {abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrar}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">
                {turnoAEditar ? "Editar Turno" : "Agendar Nuevo Turno"}
              </h2>
              <button
                onClick={cerrar}
                className="text-gray-400 hover:text-gray-900 bg-white rounded-full p-1 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmitForm)}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Nombre del Cliente
                </label>
                <input
                  {...register("cliente", { required: true })}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Ej: Elena García"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Servicio
                  </label>
                  <input
                    {...register("servicio", { required: true })}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Ej: Corte y Brushing"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Fecha
                  </label>
                  {/* 👉 ACÁ ESTÁ EL BLOQUEO DE 2 MESES */}
                  <input
                    {...register("fecha", { required: true })}
                    type="date"
                    min={hoyStr}
                    max={maxMeseStr}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Hora
                  </label>
                  <input
                    {...register("hora", { required: true })}
                    type="time"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  {...register("estado")}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500 bg-white"
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="CONFIRMADO">Confirmado</option>
                  <option value="EN PROCESO">En Proceso</option>
                  <option value="COMPLETADO">Completado</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={cerrar}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-pink-600 text-white font-bold rounded-xl shadow-md hover:bg-pink-700 transition-colors"
                >
                  {turnoAEditar ? "Guardar Cambios" : "Confirmar Turno"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ModalTurno;
