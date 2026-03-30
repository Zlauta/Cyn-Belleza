import React from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, ArrowRight, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { registroService } from "../services/auth.services.js";

const Registro = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const loadToast = toast.loading("Creando tu cuenta...");

    try {
      // 1. Llamamos al servicio
      const respuesta = await registroService(data);

      // 👉 2. LA MEJORA UX: Guardamos el token automáticamente
      if (respuesta.token) {
        localStorage.setItem("token", respuesta.token);
      }
      if (respuesta.usuario) {
        localStorage.setItem("usuario", JSON.stringify(respuesta.usuario));
      }

      // 3. Mostramos el Toast de éxito
      toast.success("¡Registro exitoso! Ya puedes reservar.", {
        id: loadToast,
      });

      // 👉 4. Lo mandamos directo al Inicio (o a /reservar si preferís)
      navigate("/");
    } catch (error) {
      toast.error(error.message, { id: loadToast });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen flex bg-white flex-row-reverse"
    >
      {/* 🖼️ Mitad DERECHA: Imagen */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-pink-900/20 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200"
          alt="Spa y Belleza CYN"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-20 right-12 z-20 text-white max-w-md text-right">
          <motion.h2
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-bold mb-4"
          >
            Únete a<br /> la <span className="text-white/80">familia</span>.
          </motion.h2>
        </div>
      </div>

      {/* 📝 Mitad IZQUIERDA: Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-pink-600 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </Link>

          <div className="text-center lg:text-left mb-10">
            <Link
              to="/"
              className="text-3xl font-bold text-black inline-block mb-2 hover:scale-105 transition-transform"
            >
              CYN <span className="text-pink-600">Belleza</span>
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900 mt-6">
              Crea tu cuenta ✨
            </h1>
            <p className="text-gray-500 mt-2">
              Gestiona tus turnos en segundos.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Input Nombre */}
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

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full flex items-center justify-center py-3 px-4 mt-4 border border-transparent rounded-lg shadow-sm text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black font-semibold text-lg transition-colors"
            >
              Crear Cuenta 
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-600 border-t pt-6">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="font-semibold text-black hover:text-pink-600 transition-colors"
            >
              <ArrowRight className="inline h-4 w-4 rotate-180" /> Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Registro;
