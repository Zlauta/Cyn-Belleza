import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

const ModalServicio = ({
  abierto,
  cerrar,
  servicioAEditar,
  onSubmitForm,
  categorias,
}) => {
  const valoresPorDefecto = {
    nombre: "",
    categoria: "Peluquería",
    precio: "",
    duracion: "",
    descripcion: "",
    estado: "Activo",
  };
  const { register, handleSubmit, reset } = useForm({
    // Si hay un servicio para editar, lo usa. Si no, usa los valores en blanco.
    values: servicioAEditar ? servicioAEditar : valoresPorDefecto,
    resetOptions: {
      keepDirtyValues: false, // Esto asegura que si abrís otro servicio, se limpie perfecto
    },
  });

  // (Opcional pero recomendado para limpiar al cerrar)
  useEffect(() => {
    if (!abierto) {
      reset(valoresPorDefecto);
    }
  }, [abierto, reset]);

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
                {servicioAEditar ? "Editar Servicio" : "Nuevo Servicio"}
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
                  Nombre del Servicio
                </label>
                <input
                  {...register("nombre", { required: true })}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Ej: Corte y Brushing"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    {...register("categoria")}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500 bg-white"
                  >
                    {categorias
                      .filter((c) => c !== "Todas")
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Precio ($)
                  </label>
                  <input
                    {...register("precio", { required: true })}
                    type="number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500"
                    placeholder="15000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Duración
                  </label>
                  <input
                    {...register("duracion", { required: true })}
                    type="number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Ej: 60 min"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    {...register("estado")}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500 bg-white"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Descripción Breve
                </label>
                <textarea
                  {...register("descripcion")}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500 resize-none"
                  placeholder="Describe el servicio..."
                ></textarea>
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
                  {servicioAEditar ? "Guardar Cambios" : "Crear Servicio"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ModalServicio;
