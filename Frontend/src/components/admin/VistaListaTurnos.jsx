import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Eye, X } from 'lucide-react';

const VistaListaTurnos = ({ turnos, abrirModalEditar, solicitarCancelacion }) => {
  return (
    <motion.div key="lista" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-gray-400 font-bold border-b border-gray-100 bg-gray-50/50">
              <th className="p-4 pl-6">Cliente</th>
              <th className="p-4">Servicio / Fecha</th>
              <th className="p-4">Estado</th>
              <th className="p-4 pr-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {turnos.map((turno) => (
              <tr key={turno.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-bold text-pink-600">{turno.iniciales}</div>
                    <span className="font-bold text-gray-900">{turno.cliente}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm font-medium text-gray-900">{turno.servicio}</div>
                  <div className="text-xs text-gray-500">{turno.fechaObj ? format(turno.fechaObj, 'dd/MM/yyyy') : ''} a las {turno.hora}</div>
                </td>
                <td className="p-4">
                  <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full ${turno.estado === 'PENDIENTE' ? 'bg-amber-100 text-amber-700' : turno.estado === 'CANCELADO' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {turno.estado}
                  </span>
                </td>
                <td className="p-4 pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => abrirModalEditar(turno)} className="p-1.5 text-gray-400 border border-gray-200 hover:text-gray-900 hover:bg-gray-50 rounded-md"><Eye className="w-4 h-4" /></button>
                    {turno.estado !== 'CANCELADO' && (
                      <button onClick={() => solicitarCancelacion(turno.id, `turno de ${turno.cliente}`)} className="p-1.5 text-red-500 border border-red-200 hover:bg-red-50 rounded-md"><X className="w-4 h-4" /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default VistaListaTurnos;