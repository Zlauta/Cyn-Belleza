import React from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Registro = () => {
  // Inicializamos react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  // Función que se ejecuta al enviar el formulario válido
  const onSubmit = (data) => {
    console.log("Datos listos para enviar al backend:", data);

    // Disparamos el Toast de éxito
    toast.success("¡Registro exitoso! Preparando tu cuenta...", {
      style: {
        border: "1px solid #db2777", // pink-600
        padding: "16px",
        color: "#111827",
      },
      iconTheme: {
        primary: "#db2777",
        secondary: "#FFFAEE",
      },
    });

    // Simulamos que el backend responde y lo mandamos al login
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }} // Sale hacia la derecha suavemente
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen flex bg-white flex-row-reverse"
    >
      {/* Mitad Derecha: Imagen decorativa */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-pink-900/20 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200"
          alt="Spa y Belleza"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-20 right-12 z-20 text-white max-w-md text-right">
          <motion.h2
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-bold mb-4"
          >
            Únete a la familia.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-white/90 drop-shadow-md"
          >
            Crea tu cuenta hoy y comienza a disfrutar de un servicio
            personalizado y reservas al instante.
          </motion.p>
        </div>
      </div>

      {/* Mitad Izquierda: Formulario animado con react-hook-form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <Link
              to="/"
              className="text-3xl font-bold text-black inline-block mb-2"
            >
              CYN <span className="text-pink-600">Belleza</span>
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900 mt-6">
              Crea tu cuenta ✨
            </h1>
            <p className="text-gray-500 mt-2">
              Comienza a gestionar tus turnos en segundos.
            </p>
          </div>

          {/* Envolvemos el form con handleSubmit de hook-form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Input Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register("nombre", {
                    required: "El nombre es obligatorio",
                  })}
                  className={`block w-full pl-10 pr-3 py-3 border ${errors.nombre ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-pink-500 focus:border-pink-500"} rounded-lg transition-colors`}
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
                  <Mail className="h-5 w-5 text-gray-400" />
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
                  className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-pink-500"} rounded-lg transition-colors`}
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
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  {...register("telefono", {
                    required: "El teléfono es obligatorio",
                  })}
                  className={`block w-full pl-10 pr-3 py-3 border ${errors.telefono ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-pink-500"} rounded-lg transition-colors`}
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
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  {...register("contrasenia", {
                    required: "La contraseña es obligatoria",
                    minLength: { value: 6, message: "Mínimo 6 caracteres" },
                  })}
                  className={`block w-full pl-10 pr-3 py-3 border ${errors.contrasenia ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-pink-500"} rounded-lg transition-colors`}
                  placeholder="••••••••"
                />
              </div>
              {errors.contrasenia && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.contrasenia.message}
                </p>
              )}
            </div>

            {/* Botón Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full flex items-center justify-center py-3 px-4 mt-4 border border-transparent rounded-lg shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 font-medium text-lg transition-colors"
            >
              Crear Cuenta
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="font-semibold text-pink-600 hover:text-pink-500 transition-colors"
            >
              Inicia sesión
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Registro;
