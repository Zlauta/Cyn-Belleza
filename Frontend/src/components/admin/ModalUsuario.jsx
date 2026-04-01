import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

const ModalUsuario = ({ abierto, cerrar, usuarioAEditar, onSubmitForm }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (usuarioAEditar) {
      reset({ ...usuarioAEditar, contrasenia: "" });
    } else {
      reset({ nombre: "", email: "", contrasenia: "", rol: "CLIENTE" });
    }
  }, [usuarioAEditar, abierto, reset]);

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
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">
                {usuarioAEditar ? "Editar Usuario" : "Nuevo Usuario"}
              </h2>
              <button
                type="button"
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
                  Nombre Completo
                </label>
                <input
                  {...register("nombre", {
                    required: "El nombre es obligatorio",
                  })}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500"
                />
                {errors.nombre && (
                  <span className="text-xs text-red-500">
                    {errors.nombre.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  {...register("email", {
                    required: "El email es obligatorio",
                  })}
                  type="email"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Contraseña{" "}
                  {usuarioAEditar && (
                    <span className="text-xs text-gray-400 font-normal">
                      (Opcional)
                    </span>
                  )}
                </label>
                <input
                  {...register("contrasenia", {
                    required: !usuarioAEditar
                      ? "La contraseña es obligatoria"
                      : false,
                  })}
                  type="password"
                  placeholder={usuarioAEditar ? "********" : ""}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500"
                />
                {errors.contrasenia && (
                  <span className="text-xs text-red-500">
                    {errors.contrasenia.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Rol del Sistema
                </label>
                <select
                  {...register("rol")}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500 bg-white"
                >
                  <option value="CLIENTE">Cliente</option>
                  <option value="ADMIN">Administrador</option>
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
                  {usuarioAEditar ? "Guardar Cambios" : "Crear Usuario"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ModalUsuario;
