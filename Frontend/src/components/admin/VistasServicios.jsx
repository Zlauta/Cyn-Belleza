import React from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2, Tag, Clock } from "lucide-react";

export const VistaTabla = ({ servicios, abrirModal, handleDelete }) => (
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
            <th className="p-4 pr-6 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {servicios.map((servicio) => (
            <tr
              key={servicio.id}
              className="hover:bg-gray-50/50 transition-colors group"
            >
              <td className="p-4 pl-6">
                <div className="flex items-center gap-4">
                  {/* Placeholder de color en vez de imagen */}
                  <div className="w-10 h-10 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-lg">
                    {servicio.nombre.charAt(0).toUpperCase()}
                  </div>
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
                ${Number(servicio.precio).toLocaleString("es-AR")}
              </td>
              <td className="p-4 text-sm text-gray-600">{servicio.duracion}</td>
              <td className="p-4 pr-6 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => abrirModal(servicio)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(servicio.id, servicio.nombre)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
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
);

export const VistaTarjetas = ({ servicios, abrirModal, handleDelete }) => (
  <motion.div
    key="vista-tarjetas"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
  >
    {servicios.map((servicio) => (
      <motion.div
        layout
        key={servicio.id}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
      >
        {/* Encabezado de la tarjeta sin imagen */}
        <div className="h-24 bg-gradient-to-r from-pink-50 to-pink-100 flex items-center justify-center relative border-b border-pink-100">
          <div className="absolute top-3 left-3">
            <span className="text-xs font-bold text-pink-600 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
              {servicio.categoria}
            </span>
          </div>
          <Tag className="w-8 h-8 text-pink-300" />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
            {servicio.nombre}
          </h3>
          <div className="flex items-center gap-4 mt-auto mb-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4 text-pink-500" />
              <span className="font-bold text-gray-900">
                ${Number(servicio.precio).toLocaleString("es-AR")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{servicio.duracion}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
            <button
              onClick={() => abrirModal(servicio)}
              className="flex-1 flex justify-center items-center gap-2 py-2 text-sm font-bold text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" /> Editar
            </button>
            <button
              onClick={() => handleDelete(servicio.id, servicio.nombre)}
              className="px-3 py-2 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    ))}
  </motion.div>
);
