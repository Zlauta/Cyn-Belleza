import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Tag,
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";

const MENU_ADMIN = [
  { nombre: "Dashboard", ruta: "/admin", icono: LayoutDashboard },
  { nombre: "Gestión de Turnos", ruta: "/admin/turnos", icono: Calendar },
  { nombre: "Clientes", ruta: "/admin/usuarios", icono: Users },
  { nombre: "Servicios", ruta: "/admin/servicios", icono: Tag },
];

const AdminLayout = ({ children }) => {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Leemos los datos de Cynthia
  const usuarioString = localStorage.getItem("usuario");
  const usuario = usuarioString
    ? JSON.parse(usuarioString)
    : { nombre: "Admin CYN" };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    toast.success("Sesión de administrador cerrada.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 📱 FONDO OSCURO PARA MÓVIL CUANDO EL SIDEBAR ESTÁ ABIERTO */}
      <AnimatePresence>
        {sidebarAbierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarAbierto(false)}
            className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* 🗄️ SIDEBAR LATERAL */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transform transition-transform duration-300 ease-in-out ${
          sidebarAbierto
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo Admin */}
        <div className="h-20 flex items-center px-8 border-b border-gray-50">
          <Link to="/" className="text-2xl font-black text-black">
            CYN{" "}
            <span className="text-pink-600 uppercase text-sm tracking-widest block font-bold">
              Admin Panel
            </span>
          </Link>
        </div>

        {/* Menú de Navegación */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {MENU_ADMIN.map((item) => {
            const activo = location.pathname === item.ruta;
            const Icono = item.icono;
            return (
              <Link
                key={item.nombre}
                to={item.ruta}
                onClick={() => setSidebarAbierto(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                  activo
                    ? "bg-pink-50 text-pink-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icono
                  className={`w-5 h-5 ${activo ? "text-pink-600" : "text-gray-400"}`}
                />
                {item.nombre}
              </Link>
            );
          })}
        </nav>

        {/* Botón Salir */}
        <div className="p-4 border-t border-gray-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </motion.aside>

      {/* 🖥️ ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarAbierto(true)}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Buscador (Visual) */}
            <div className="hidden md:flex items-center bg-gray-50 rounded-full px-4 py-2 w-96 border border-gray-100 focus-within:border-pink-300 focus-within:ring-2 focus-within:ring-pink-100 transition-all">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Buscar clientes, servicios..."
                className="bg-transparent border-none focus:ring-0 text-sm w-full text-gray-700 placeholder-gray-400 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button className="text-gray-400 hover:text-pink-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-pink-600 rounded-full border-2 border-white"></span>
            </button>
            <button className="text-gray-400 hover:text-pink-600 transition-colors hidden sm:block">
              <Settings className="w-5 h-5" />
            </button>

            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

            {/* Perfil Cynthia */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-gray-900">
                  {usuario.nombre.split(" ")[0]}
                </p>
                <p className="text-xs text-pink-600 font-bold tracking-wider">
                  ADMINISTRADORA
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-pink-100 border-2 border-white shadow-sm flex items-center justify-center text-pink-600 font-bold text-lg overflow-hidden">
                {/* Asumimos que es Cynthia, ponemos un emoji lindo, o podrías poner la foto de perfil si la tuvieras */}
                👩🏻‍💼
              </div>
            </div>
          </div>
        </header>

        {/* Contenido Dinámico de la Página */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
