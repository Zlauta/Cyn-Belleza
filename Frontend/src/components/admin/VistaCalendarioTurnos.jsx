import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { es } from 'date-fns/locale';

const VistaCalendarioTurnos = ({ turnos, mesActual, setMesActual, abrirModalEditar }) => {
  const diasDelMes = eachDayOfInterval({ 
    start: startOfWeek(startOfMonth(mesActual), { weekStartsOn: 1 }), 
    end: endOfWeek(endOfMonth(mesActual), { weekStartsOn: 1 }) 
  });

  return (
    <motion.div key="calendario" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col xl:flex-row gap-6">
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col w-full">
        <div className="p-4 sm:p-6 border-b border-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 capitalize">{format(mesActual, 'MMMM yyyy', { locale: es })}</h2>
            <div className="flex gap-1">
              <button onClick={() => setMesActual(subMonths(mesActual, 1))} className="p-1 sm:p-1.5 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
              <button onClick={() => setMesActual(addMonths(mesActual, 1))} className="p-1 sm:p-1.5 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto hide-scrollbar w-full">
          <div className="min-w-[700px] lg:min-w-full">
            <div className="grid grid-cols-7 border-b border-gray-50">
              {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map(dia => (
                <div key={dia} className="py-3 text-center text-xs font-bold text-gray-400">{dia}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 auto-rows-[100px] sm:auto-rows-[120px]">
              {diasDelMes.map((dia) => {
                const esMesActual = isSameMonth(dia, mesActual);
                const esHoy = isToday(dia);
                const turnosDelDia = turnos.filter(t => t.fechaObj && isSameDay(t.fechaObj, dia) && t.estado !== 'CANCELADO');

                return (
                  <div key={dia.toString()} className={`border-b border-r border-gray-50 p-1 sm:p-2 flex flex-col gap-1 hover:bg-gray-50 transition-colors cursor-pointer ${!esMesActual ? 'bg-gray-50/50' : ''} ${esHoy ? 'bg-pink-50/30' : ''}`}>
                    <span className={`text-xs sm:text-sm font-medium w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full ${esHoy ? 'bg-pink-600 text-white font-bold' : (!esMesActual ? 'text-gray-300' : 'text-gray-700')}`}>
                      {format(dia, 'd')}
                    </span>
                    
                    <div className="flex-1 overflow-y-auto hide-scrollbar space-y-1 mt-1">
                      {turnosDelDia.map(turno => (
                        <div key={turno.id} onClick={() => abrirModalEditar(turno)} className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-1 rounded w-full truncate ${turno.estado === 'PENDIENTE' ? 'bg-amber-100 text-amber-700' : 'bg-pink-100 text-pink-700'}`}>
                          {turno.hora} - {turno.cliente.split(' ')[0]}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full xl:w-80 flex flex-col gap-6 shrink-0">
        <div className="bg-pink-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <h3 className="font-bold text-pink-100 tracking-wider text-sm mb-4">HOY</h3>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-5xl font-black">{turnos.filter(t => isToday(t.fechaObj) && t.estado !== 'CANCELADO').length}</span>
            <span className="text-xl font-medium text-pink-100">Turnos</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VistaCalendarioTurnos;