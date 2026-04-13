import React, { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SelectorServicios = ({
  categorias,
  servicioSeleccionado,
  setServicioSeleccionado,
}) => {
  const [categoriaAbierta, setCategoriaAbierta] = useState(null);

  // 👉 Opcional pero recomendado: Limpiamos categorías que no tengan servicios activos
  // Así evitamos mostrar categorías vacías.
  const categoriasConServiciosActivos = categorias
    .map((cat) => ({
      ...cat,
      servicios: cat.servicios.filter((srv) => srv.activo),
    }))
    .filter((cat) => cat.servicios.length > 0);

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <span className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
          1
        </span>
        <h2 className="text-2xl font-bold text-gray-900">
          Selecciona un Servicio
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* 👉 Usamos el array filtrado */}
        {categoriasConServiciosActivos.map((cat) => (
          <div
            key={cat.categoria}
            className="border-b border-gray-50 last:border-0"
          >
            {/* Header de la categoría */}
            <button
              onClick={() =>
                setCategoriaAbierta(
                  categoriaAbierta === cat.categoria ? null : cat.categoria,
                )
              }
              className="w-full flex items-center justify-between p-5 bg-gray-50/50 hover:bg-pink-50/30 transition-colors"
            >
              <h3 className="font-bold text-lg text-gray-800">
                {cat.categoria}
              </h3>
              {categoriaAbierta === cat.categoria ? (
                <ChevronUp className="w-5 h-5 text-pink-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {/* Lista de servicios (Colapsable) */}
            <AnimatePresence>
              {categoriaAbierta === cat.categoria && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-2 space-y-1">
                    {/* 👉 Los servicios ya vienen filtrados por el map de arriba */}
                    {cat.servicios.map((srv) => {
                      const esSeleccionado =
                        servicioSeleccionado?.id === srv.id;
                      return (
                        <div
                          key={srv.id}
                          onClick={() => setServicioSeleccionado(srv)}
                          className={`group flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                            esSeleccionado
                              ? "bg-pink-50 border border-pink-200"
                              : "hover:bg-gray-50 border border-transparent"
                          }`}
                        >
                          <div className="flex-1 min-w-0 pr-3">
                            <p
                              className={`font-semibold truncate sm:whitespace-normal ${esSeleccionado ? "text-pink-700" : "text-gray-900 group-hover:text-pink-600"}`}
                            >
                              {srv.nombre}
                            </p>
                            <p className="text-sm text-gray-500">
                              {srv.duracion} min
                            </p>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-bold text-gray-900">
                              ${srv.precio.toLocaleString("es-AR")}
                            </span>
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 ${
                                esSeleccionado
                                  ? "border-pink-600 bg-pink-600"
                                  : "border-gray-200"
                              }`}
                            >
                              {esSeleccionado && (
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SelectorServicios;
