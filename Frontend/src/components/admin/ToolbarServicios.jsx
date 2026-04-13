import React from "react";
import { Search, Filter, List, LayoutGrid, Eye, EyeOff } from "lucide-react";

const ToolbarServicios = ({
  busqueda,
  setBusqueda,
  categoriaActiva,
  setCategoriaActiva,
  categorias,
  estadoFiltro,
  setEstadoFiltro, // 👉 Nuevo estado
  vista,
  setVista,
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 justify-between items-center">
      <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">
        {/* Buscador */}
        <div className="relative w-full sm:w-64">
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

        {/* Filtro Categoría */}
        <select
          value={categoriaActiva}
          onChange={(e) => setCategoriaActiva(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500 text-sm bg-white cursor-pointer"
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* 👉 NUEVO: Filtro Estado */}
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500 text-sm bg-white cursor-pointer"
        >
          <option value="Todos">Todos los Estados</option>
          <option value="Activo">Solo Activos</option>
          <option value="Inactivo">Solo Inactivos</option>
        </select>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-xl shrink-0">
        <button
          onClick={() => setVista("tabla")}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${vista === "tabla" ? "bg-white text-pink-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          <List className="w-4 h-4" /> Tabla
        </button>
        <button
          onClick={() => setVista("tarjetas")}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${vista === "tarjetas" ? "bg-white text-pink-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          <LayoutGrid className="w-4 h-4" /> Tarjetas
        </button>
      </div>
    </div>
  );
};

export default ToolbarServicios;
