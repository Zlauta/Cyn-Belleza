import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Settings, CalendarClock } from "lucide-react"; // 👉 Sumé CalendarClock
import toast from "react-hot-toast";

// 👉 IMPORTAMOS TU SERVICIO
import { obtenerMisTurnosService } from "../services/turno.services.js";

const LINKS = [
  { nombre: "Inicio", ruta: "/" },
  { nombre: "Servicios", ruta: "/servicios" },
  { nombre: "Nosotros", ruta: "/#nosotros" },
];

const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [estaLogueado, setEstaLogueado] = useState(false);
  const [usuario, setUsuario] = useState(null);

  // 👉 ESTADO PARA CONTROLAR SI MOSTRAMOS EL BOTÓN
  const [tieneTurnos, setTieneTurnos] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const esAdmin = usuario?.rol === "ADMIN";

  // 👉 FUNCIÓN PARA VERIFICAR TURNOS EN SEGUNDO PLANO
  const verificarTurnosActivos = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setTieneTurnos(false);
      return;
    }

    try {
      const turnos = await obtenerMisTurnosService();
      if (turnos && Array.isArray(turnos)) {
        // Solo mostramos si hay turnos que NO estén cancelados o finalizados
        const turnosPendientes = turnos.filter(
          (t) => t.estado !== "CANCELADO" && t.estado !== "FINALIZADO",
        );
        setTieneTurnos(turnosPendientes.length > 0);
      }
    } catch (error) {
      console.error("Error al verificar turnos en el Navbar", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuarioString = localStorage.getItem("usuario");

    setEstaLogueado(!!token);

    if (usuarioString) {
      setUsuario(JSON.parse(usuarioString));
    } else {
      setUsuario(null);
    }

    // Verificamos apenas carga o cambia la ruta
    verificarTurnosActivos();

    // 👉 ESCUCHAMOS EL EVENTO CUANDO SE CREA O CANCELA UN TURNO
    window.addEventListener("storage", verificarTurnosActivos);
    return () => window.removeEventListener("storage", verificarTurnosActivos);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setEstaLogueado(false);
    setUsuario(null);
    setTieneTurnos(false); // Limpiamos el botón al salir
    toast.success("¡Sesión cerrada! Esperamos verte pronto.", { icon: "👋" });
    navigate("/");
  };

  const handleNavClick = (e, link) => {
    if (link.nombre === "Nosotros") {
      if (location.pathname === "/") {
        e.preventDefault();
        document
          .getElementById("nosotros")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMenuAbierto(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* 🌺 LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl font-black tracking-tighter text-black transition-transform group-hover:scale-105">
              CYN <span className="text-pink-600">Belleza</span>
            </span>
          </Link>

          {/* 💻 LINKS DESKTOP */}
          <div className="hidden md:flex items-center space-x-2">
            {LINKS.map((link) => {
              const estaActivo =
                link.nombre === "Nosotros"
                  ? location.hash === "#nosotros"
                  : location.pathname === link.ruta &&
                    location.hash !== "#nosotros";

              return (
                <Link
                  key={link.nombre}
                  to={link.ruta}
                  onClick={(e) => handleNavClick(e, link)}
                  className="relative px-4 py-2"
                >
                  {estaActivo && (
                    <motion.div
                      layoutId="burbuja-navbar"
                      className="absolute inset-0 bg-pink-50 rounded-full -z-10"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <motion.span
                    animate={{
                      color: estaActivo ? "#db2777" : "#4b5563",
                      scale: estaActivo ? 1.05 : 1,
                      fontWeight: estaActivo ? 700 : 500,
                    }}
                    className="relative z-10 text-sm block transition-colors hover:text-pink-600"
                  >
                    {link.nombre}
                  </motion.span>
                </Link>
              );
            })}
          </div>

          {/* 🚀 BOTONES DERECHA DESKTOP */}
          <div className="hidden md:flex items-center space-x-4">
            {estaLogueado ? (
              <div className="flex items-center gap-3 border-r pr-4 border-gray-200">
                <span className="text-sm font-semibold text-gray-700">
                  Hola, {usuario?.nombre?.split(" ")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-gray-500 hover:text-pink-600 transition-colors p-2 rounded-full hover:bg-pink-50"
                title="Iniciar Sesión"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

            {esAdmin && (
              <Link
                to="/admin"
                className="text-pink-600 hover:text-pink-700 font-bold text-sm transition-colors mr-2"
              >
                Panel Admin
              </Link>
            )}

            {/* 👉 BOTÓN MÁGICO DE MIS TURNOS (DESKTOP) */}
            {estaLogueado && !esAdmin && tieneTurnos && (
              <Link
                to="/mis-turnos"
                className="flex items-center gap-1 text-pink-600 hover:text-pink-800 font-bold text-sm transition-colors mr-2"
              >
                <CalendarClock className="w-4 h-4" />
                Mis Turnos
              </Link>
            )}

            <Link to="/reservar">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-black/20 hover:bg-gray-800 transition-colors"
              >
                Reservar Turno
              </motion.button>
            </Link>
          </div>

          {/* 🍔 BOTÓN MENÚ HAMBURGUESA (Móvil) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="text-gray-600 hover:text-pink-600 focus:outline-none p-2"
            >
              {menuAbierto ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 📱 MENÚ DESPLEGABLE MÓVIL */}
      <AnimatePresence>
        {menuAbierto && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white border-t border-gray-100 shadow-xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 shadow-inner">
              {LINKS.map((link) => {
                const estaActivo =
                  link.nombre === "Nosotros"
                    ? location.hash === "#nosotros"
                    : location.pathname === link.ruta &&
                      location.hash !== "#nosotros";

                return (
                  <Link
                    key={link.nombre}
                    to={link.ruta}
                    onClick={(e) => handleNavClick(e, link)}
                    className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                      estaActivo
                        ? "bg-pink-50 text-pink-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {link.nombre}
                  </Link>
                );
              })}

              <div className="pt-4 flex flex-col gap-3 border-t border-gray-100 mt-2">
                {esAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuAbierto(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-pink-100 text-pink-600 rounded-xl font-bold hover:bg-pink-50 transition-colors"
                  >
                    <Settings className="w-5 h-5" /> Panel de Administración
                  </Link>
                )}

                {/* 👉 BOTÓN MÁGICO DE MIS TURNOS (MÓVIL) */}
                {estaLogueado && !esAdmin && tieneTurnos && (
                  <Link
                    to="/mis-turnos"
                    onClick={() => setMenuAbierto(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-pink-50 border border-pink-200 text-pink-600 rounded-xl font-bold hover:bg-pink-100 transition-colors"
                  >
                    <CalendarClock className="w-5 h-5" /> Mis Turnos Activos
                  </Link>
                )}

                {estaLogueado ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuAbierto(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-100 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" /> Cerrar Sesión
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMenuAbierto(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-5 h-5" /> Mi Cuenta
                  </Link>
                )}

                <Link
                  to="/reservar"
                  onClick={() => setMenuAbierto(false)}
                  className="w-full text-center bg-black text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-800"
                >
                  Reservar Turno
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
