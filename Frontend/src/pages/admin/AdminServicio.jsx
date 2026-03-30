import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  LayoutGrid,
  List,
  Tag,
  Filter,
  Clock,
} from "lucide-react";

// 📦 Datos simulados (Luego vendrán de tu base de datos con Axios)
const SERVICIOS_MOCK = [
  {
    id: 1,
    categoria: "Peluquería",
    nombre: "Corte y Brushing",
    precio: 15000,
    duracion: "60 min",
    estado: "Activo",
    imagen:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=200",
  },
  {
    id: 2,
    categoria: "Peluquería",
    nombre: "Coloración Global",
    precio: 45000,
    duracion: "120 min",
    estado: "Activo",
    imagen:
      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=200",
  },
  {
    id: 3,
    categoria: "Uñas",
    nombre: "Manicura Semi-permanente",
    precio: 12000,
    duracion: "60 min",
    estado: "Activo",
    imagen:
      "https://images.unsplash.com/photo-1604654894610-df490668710d?q=80&w=200",
  },
  {
    id: 4,
    categoria: "Pestañas y Cejas",
    nombre: "Lifting de Pestañas",
    precio: 18000,
    duracion: "60 min",
    estado: "Inactivo",
    imagen:
      "https://images.unsplash.com/photo-1583011319767-464a4c16c805?q=80&w=200",
  },
  {
    id: 5,
    categoria: "Maquillaje",
    nombre: "Maquillaje Social",
    precio: 25000,
    duracion: "60 min",
    estado: "Activo",
    imagen:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=200",
  },
];

const CATEGORIAS = [
  "Todas",
  "Peluquería",
  "Uñas",
  "Pestañas y Cejas",
  "Maquillaje",
];

const AdminServicios = () => {
  // 🎛️ ESTADOS DEL COMPONENTE
  const [vista, setVista] = useState("tabla"); // 'tabla' o 'tarjetas'
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");

  // 👉 LÓGICA DE FILTRADO (Buscador + Categorías)
  const serviciosFiltrados = SERVICIOS_MOCK.filter((servicio) => {
    // 1. Filtro por categoría
    const coincideCategoria =
      categoriaActiva === "Todas" || servicio.categoria === categoriaActiva;

    // 2. Filtro por búsqueda (nombre)
    const coincideBusqueda = servicio.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 🚀 CABECERA Y BOTÓN AGREGAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Catálogo de Servicios
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestiona los tratamientos, precios y duraciones.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-pink-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-pink-700 transition-colors shrink-0">
          <Plus className="w-5 h-5" /> Nuevo Servicio
        </button>
      </div>

      {/* 🎛️ BARRA DE HERRAMIENTAS (Filtros, Buscador y Toggle de Vista) */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">
          {/* Buscador */}
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar servicio..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500 text-sm transition-colors"
            />
          </div>

          {/* Selector de Categorías */}
          <div className="relative w-full sm:w-56">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={categoriaActiva}
              onChange={(e) => setCategoriaActiva(e.target.value)}
              className="block w-full pl-10 pr-8 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500 text-sm text-gray-700 appearance-none bg-white transition-colors cursor-pointer"
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
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

      {/* 📊 ÁREA DE CONTENIDO (Muestra Tabla o Tarjetas según el estado) */}
      <AnimatePresence mode="wait">
        {serviciosFiltrados.length === 0 ? (
          // ESTADO VACÍO: Cuando la búsqueda no encuentra nada
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm"
          >
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">
              No se encontraron servicios
            </h3>
            <p className="text-gray-500">
              Prueba con otro término de búsqueda o cambia la categoría.
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
                    <th className="p-4 pl-6">Servicio</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4">Precio</th>
                    <th className="p-4">Duración</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 pr-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {serviciosFiltrados.map((servicio) => (
                    <tr
                      key={servicio.id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={servicio.imagen}
                            alt={servicio.nombre}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                          />
                          <span className="font-bold text-gray-900">
                            {servicio.nombre}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded-md">
                          {servicio.categoria}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-gray-900">
                        ${servicio.precio.toLocaleString("es-AR")}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {servicio.duracion}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${servicio.estado === "Activo" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}
                        >
                          {servicio.estado}
                        </span>
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
            {serviciosFiltrados.map((servicio) => (
              <motion.div
                layout // Permite que las tarjetas se reacomoden suavemente al filtrar
                key={servicio.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={servicio.imagen}
                    alt={servicio.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-bold text-pink-600 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
                      {servicio.categoria}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full shadow-sm backdrop-blur-sm ${servicio.estado === "Activo" ? "bg-emerald-500/90 text-white" : "bg-gray-800/90 text-white"}`}
                    >
                      {servicio.estado}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                    {servicio.nombre}
                  </h3>

                  <div className="flex items-center gap-4 mt-auto mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4 text-pink-500" />
                      <span className="font-bold text-gray-900">
                        ${servicio.precio.toLocaleString("es-AR")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{servicio.duracion}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <button className="flex-1 flex justify-center items-center gap-2 py-2 text-sm font-bold text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" /> Editar
                    </button>
                    <button className="px-3 py-2 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
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

export default AdminServicios;
