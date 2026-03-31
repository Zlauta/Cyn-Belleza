import React from "react";
import { Search, Filter, List, LayoutGrid } from "lucide-react";

const ToolbarServicios = ({
  busqueda,
  setBusqueda,
  categoriaActiva,
  setCategoriaActiva,
  categorias,
  vista,
  setVista,
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 justify-between items-center">
      <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">
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

        <div className="relative w-full sm:w-56">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-gray-400" />
          </div>
          <select
            value={categoriaActiva}
            onChange={(e) => setCategoriaActiva(e.target.value)}
            className="block w-full pl-10 pr-8 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500 text-sm text-gray-700 appearance-none bg-white transition-colors cursor-pointer"
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
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
