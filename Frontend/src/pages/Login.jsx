import React from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

// 👉 Importamos el servicio en lugar de axios directo
import { loginService } from "../services/auth.services.js";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const loadToast = toast.loading('Verificando credenciales...');

    try {
      const respuesta = await loginService(data);
      console.log("👀 DATA DEL BACKEND:", respuesta);

      // 👉 ACÁ ESTÁ LA MAGIA: Apuntamos a respuesta.datos
      const tokenGuardar = respuesta.datos?.token || respuesta.token;
      const usuarioGuardar = respuesta.datos?.usuario || respuesta.usuario;

      if (tokenGuardar) {
        localStorage.setItem('token', tokenGuardar);
      } else {
        toast.error("Error: El servidor no devolvió el token", { id: loadToast });
        return; // Cortamos la ejecución si no hay token
      }

      if (usuarioGuardar) {
        // Aseguramos que el rol esté en mayúsculas por si acaso
        if (usuarioGuardar.rol) {
          usuarioGuardar.rol = usuarioGuardar.rol.toUpperCase();
        }
        localStorage.setItem('usuario', JSON.stringify(usuarioGuardar));
      }

      toast.success('¡Bienvenido/a de nuevo!', { id: loadToast });
      navigate('/'); 

    } catch (error) {
      toast.error(error.message, { id: loadToast });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen flex bg-white"
    >
      {/* 🖼️ Mitad Izquierda: Imagen */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1200"
          alt="Salón de belleza CYN"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-20 left-12 z-20 text-white max-w-md">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-bold mb-4"
          >
            Tu momento de
            <br /> <span className="text-pink-400">brillar</span>.
          </motion.h2>
        </div>
      </div>

      {/* 📝 Mitad Derecha: Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="w-full max-w-md">
          {/* BOTÓN DE VOLVER */}
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
              ¡Hola de nuevo! 👋
            </h1>
            <p className="text-gray-500 mt-2">
              Ingresa tus credenciales para continuar.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            {/* Input Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <a
                  href="#"
                  className="text-sm font-medium text-pink-600 hover:text-pink-500 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
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

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 font-semibold text-lg transition-colors"
            >
              Iniciar Sesión
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-600 border-t pt-6">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/registro"
              className="font-semibold text-pink-600 hover:text-pink-500 transition-colors"
            >
              Regístrate aquí <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
