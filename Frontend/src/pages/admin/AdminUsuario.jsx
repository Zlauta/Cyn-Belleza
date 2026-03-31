import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Mail,
  Phone,
  MoreVertical,
  ShieldAlert,
  LayoutGrid,
  List,
  Filter,
  Edit2,
  Trash2,
  Calendar,
} from "lucide-react";

// 📦 Base de datos simulada
const USUARIOS_MOCK = [
  {
    id: 1,
    nombre: "Ana García",
    email: "ana.g@gmail.com",
    telefono: "+54 381 111 2222",
    rol: "CLIENTE",
    turnos: 15,
    ultimaVisita: "15/03/2026",
  },
  {
    id: 2,
    nombre: "Lucía Fernández",
    email: "lucia.f@hotmail.com",
    telefono: "+54 381 333 4444",
    rol: "CLIENTE",
    turnos: 2,
    ultimaVisita: "Ayer",
  },
  {
    id: 3,
    nombre: "Cinthia Brandan",
    email: "admincynbelleza@gmail.com",
    telefono: "+54 381 555 6666",
    rol: "ADMIN",
    turnos: 0,
    ultimaVisita: "Hoy",
  },
  {
    id: 4,
    nombre: "Sofía Romero",
    email: "sofi.romero@yahoo.com",
    telefono: "+54 381 777 8888",
    rol: "CLIENTE",
    turnos: 8,
    ultimaVisita: "28/02/2026",
  },
  {
    id: 5,
    nombre: "Marcos Soler",
    email: "marcos.soler@gmail.com",
    telefono: "+54 381 999 0000",
    rol: "CLIENTE",
    turnos: 1,
    ultimaVisita: "Hace 1 hora",
  },
];

const ROLES = ["Todos", "CLIENTE", "ADMIN"];

const AdminUsuarios = () => {
  // 🎛️ ESTADOS DEL COMPONENTE
  const [vista, setVista] = useState("tabla"); // 'tabla' o 'tarjetas'
  const [busqueda, setBusqueda] = useState("");
  const [rolActivo, setRolActivo] = useState("Todos");

  // 👉 LÓGICA DE FILTRADO (Buscador + Filtro de Rol)
  const usuariosFiltrados = USUARIOS_MOCK.filter((usuario) => {
    // 1. Filtro por Rol
    const coincideRol = rolActivo === "Todos" || usuario.rol === rolActivo;

    // 2. Filtro por Búsqueda (busca en nombre, email o teléfono)
    const termino = busqueda.toLowerCase();
    const coincideBusqueda =
      usuario.nombre.toLowerCase().includes(termino) ||
      usuario.email.toLowerCase().includes(termino) ||
      usuario.telefono.includes(termino);

    return coincideRol && coincideBusqueda;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 🚀 CABECERA Y BOTÓN AGREGAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Base de Clientes
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Directorio de usuarios registrados en el sistema.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-pink-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-pink-700 transition-colors shrink-0">
          + Nuevo Usuario
        </button>
      </div>

      {/* 🎛️ BARRA DE HERRAMIENTAS (Filtros, Buscador y Toggle de Vista) */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">
          {/* Buscador */}
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre, email o tel..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500 text-sm transition-colors"
            />
          </div>

          {/* Selector de Rol */}
          <div className="relative w-full sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={rolActivo}
              onChange={(e) => setRolActivo(e.target.value)}
              className="block w-full pl-10 pr-8 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500 text-sm text-gray-700 appearance-none bg-white transition-colors cursor-pointer"
            >
              {ROLES.map((rol) => (
                <option key={rol} value={rol}>
                  {rol === "Todos" ? "Todos los roles" : rol}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Toggle Vista (Tabla / Tarjetas) */}
        <div className="flex bg-gray-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setVista("tabla")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              vista === "tabla"
                ? "bg-white text-pink-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <List className="w-4 h-4" /> Tabla
          </button>
          <button
            onClick={() => setVista("tarjetas")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              vista === "tarjetas"
                ? "bg-white text-pink-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Tarjetas
          </button>
        </div>
      </div>

      {/* 📊 ÁREA DE CONTENIDO */}
      <AnimatePresence mode="wait">
        {usuariosFiltrados.length === 0 ? (
          // ESTADO VACÍO
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm"
          >
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">
              No se encontraron usuarios
            </h3>
            <p className="text-gray-500">
              Prueba con otro término de búsqueda o cambia el filtro de rol.
            </p>
          </motion.div>
        ) : vista === "tabla" ? (
          // 👉 VISTA DE TABLA
          <motion.div
            key="vista-tabla"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-gray-100">
                    <th className="p-4 pl-6">Usuario</th>
                    <th className="p-4">Contacto</th>
                    <th className="p-4 text-center">Turnos</th>
                    <th className="p-4">Última Visita</th>
                    <th className="p-4">Rol</th>
                    <th className="p-4 pr-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {usuariosFiltrados.map((usuario) => (
                    <tr
                      key={usuario.id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${usuario.rol === "ADMIN" ? "bg-pink-100 text-pink-600" : "bg-gray-200 text-gray-700"}`}
                          >
                            {usuario.nombre
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .substring(0, 2)
                              .toUpperCase()}
                          </div>
                          <span className="font-bold text-gray-900">
                            {usuario.nombre}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4 text-gray-400" />{" "}
                          {usuario.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />{" "}
                          {usuario.telefono}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
                          {usuario.turnos}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600 font-medium">
                        {usuario.ultimaVisita}
                      </td>
                      <td className="p-4">
                        {usuario.rol === "ADMIN" ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded-md w-fit uppercase">
                            <ShieldAlert className="w-3 h-3" /> ADMIN
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md uppercase">
                            CLIENTE
                          </span>
                        )}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          // 👉 VISTA DE TARJETAS
          <motion.div
            key="vista-tarjetas"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {usuariosFiltrados.map((usuario) => (
              <motion.div
                layout
                key={usuario.id}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all flex flex-col group relative"
              >
                {/* Botón de opciones en la esquina */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Encabezado: Avatar y Rol */}
                <div className="flex flex-col items-center mb-4 text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl mb-3 ${usuario.rol === "ADMIN" ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-700"}`}
                  >
                    {usuario.nombre
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {usuario.nombre}
                  </h3>
                  {usuario.rol === "ADMIN" ? (
                    <span className="mt-1 flex items-center gap-1 text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full uppercase">
                      <ShieldAlert className="w-3 h-3" /> Administrador
                    </span>
                  ) : (
                    <span className="mt-1 text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full uppercase">
                      Cliente
                    </span>
                  )}
                </div>

                {/* Info de Contacto */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <Mail className="w-4 h-4 text-pink-500 shrink-0" />
                    <span className="truncate">{usuario.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <Phone className="w-4 h-4 text-pink-500 shrink-0" />
                    <span>{usuario.telefono}</span>
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                      Historial
                    </p>
                    <p className="text-sm font-black text-gray-900">
                      {usuario.turnos} Turnos
                    </p>
                  </div>
                  <div className="w-px h-8 bg-gray-100"></div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                      Última Visita
                    </p>
                    <p className="text-sm font-medium text-gray-700 flex items-center justify-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" />{" "}
                      {usuario.ultimaVisita}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsuarios;
