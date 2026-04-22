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
      reset({ nombre: "", email: "", contrasenia: "", rol: "CLIENTE", telefono: "" });
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User
                      className={`h-5 w-5 ${errors.nombre ? "text-red-400" : "text-gray-400"}`}
                    />
                  </div>
                  <input
                    type="text"
                    {...register("nombre", {
                      required: "El nombre es obligatorio",
                    })}
                    className={`block w-full pl-10 pr-3 py-3 border ${errors.nombre ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-black"} rounded-lg transition-colors`}
                    placeholder="Juan Pérez"
                  />
                </div>
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              {/* Input Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail
                      className={`h-5 w-5 ${errors.email ? "text-red-400" : "text-gray-400"}`}
                    />
                  </div>
                  <input
                    type="email"
                    {...register("email", {
                      required: "El email es obligatorio",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Formato de email inválido",
                      },
                    })}
                    className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-black"} rounded-lg transition-colors`}
                    placeholder="ejemplo@correo.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Input Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone
                      className={`h-5 w-5 ${errors.telefono ? "text-red-400" : "text-gray-400"}`}
                    />
                  </div>
                  <input
                    type="tel"
                    {...register("telefono", {
                      required: "El teléfono es obligatorio",
                    })}
                    className={`block w-full pl-10 pr-3 py-3 border ${errors.telefono ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-black"} rounded-lg transition-colors`}
                    placeholder="+54 381 123 4567"
                  />
                </div>
                {errors.telefono && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.telefono.message}
                  </p>
                )}
              </div>

              {/* Input Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock
                      className={`h-5 w-5 ${errors.contrasenia ? "text-red-400" : "text-gray-400"}`}
                    />
                  </div>
                  <input
                    type="password"
                    {...register("contrasenia", {
                      required: "La contraseña es obligatoria",
                      minLength: { value: 6, message: "Mínimo 6 caracteres" },
                    })}
                    className={`block w-full pl-10 pr-3 py-3 border ${errors.contrasenia ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-black"} rounded-lg transition-colors`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.contrasenia && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.contrasenia.message}
                  </p>
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
