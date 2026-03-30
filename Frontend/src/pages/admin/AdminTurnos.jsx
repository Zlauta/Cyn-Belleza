import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Eye,
  Filter,
  Download,
  MoreVertical,
  List,
  CalendarDays,
  Clock,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";
import { es } from "date-fns/locale";

// 📦 Datos Simulados (Generamos fechas relativas al mes actual para que siempre se vea bien)
const hoy = new Date();
const TURNOS_MOCK = [
  {
    id: 1,
    fecha: hoy,
    hora: "10:00 AM",
    cliente: "Elena García",
    iniciales: "EG",
    servicio: "Manicura Semi-permanente",
    profesional: "Carla M.",
    estado: "CONFIRMADO",
    color: "bg-pink-100 text-pink-700",
  },
  {
    id: 2,
    fecha: hoy,
    hora: "11:30 AM",
    cliente: "Roberto Torres",
    iniciales: "RT",
    servicio: "Corte y Barba",
    profesional: "David S.",
    estado: "PENDIENTE",
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: 3,
    fecha: hoy,
    hora: "12:45 PM",
    cliente: "Sofía Martínez",
    iniciales: "SM",
    servicio: "Tratamiento Facial",
    profesional: "Carla M.",
    estado: "EN PROCESO",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: 4,
    fecha: new Date(hoy.getFullYear(), hoy.getMonth(), 9),
    hora: "14:30",
    cliente: "Lucía F.",
    iniciales: "LF",
    servicio: "Corte",
    profesional: "Ana",
    estado: "CONFIRMADO",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 5,
    fecha: new Date(hoy.getFullYear(), hoy.getMonth(), 9),
    hora: "16:00",
    cliente: "Marcos S.",
    iniciales: "MS",
    servicio: "Tinte",
    profesional: "Ana",
    estado: "PENDIENTE",
    color: "bg-orange-100 text-orange-700",
  },
];

const AdminTurnos = () => {
  // 🎛️ ESTADOS
  const [vista, setVista] = useState("calendario"); // 'calendario' o 'lista'
  const [mesActual, setMesActual] = useState(startOfMonth(hoy));

  // 🗓️ LÓGICA DEL CALENDARIO
  const primerDiaDelMes = startOfMonth(mesActual);
  const ultimoDiaDelMes = endOfMonth(mesActual);
  const fechaInicio = startOfWeek(primerDiaDelMes, { weekStartsOn: 1 }); // Empieza el Lunes
  const fechaFin = endOfWeek(ultimoDiaDelMes, { weekStartsOn: 1 });
  const diasDelMes = eachDayOfInterval({ start: fechaInicio, end: fechaFin });

  const cambiarMesAnterior = () => setMesActual(subMonths(mesActual, 1));
  const cambiarMesSiguiente = () => setMesActual(addMonths(mesActual, 1));

  const diasSemana = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* 🚀 CABECERA Y TOGGLE DE VISTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Gestión de Turnos
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Organiza la agenda de belleza para hoy,{" "}
            {format(hoy, "d 'de' MMMM", { locale: es })}.
          </p>
        </div>

        {/* Toggle Calendario / Lista */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          <button
            onClick={() => setVista("calendario")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              vista === "calendario"
                ? "bg-pink-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <CalendarDays className="w-4 h-4" /> Calendario
          </button>
          <button
            onClick={() => setVista("lista")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              vista === "lista"
                ? "bg-pink-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <List className="w-4 h-4" /> Lista
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {vista === "calendario" ? (
          /* =========================================
             VISTA 1: CALENDARIO + WIDGETS LATERALES
             ========================================= */
          <motion.div
            key="calendario"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col xl:flex-row gap-6"
          >
            {/* 🗓️ COLUMNA IZQUIERDA: CALENDARIO (70%) */}
            <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              {/* Header del Calendario */}
              <div className="p-6 flex justify-between items-center border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold text-gray-900 capitalize">
                    {format(mesActual, "MMMM yyyy", { locale: es })}
                  </h2>
                  <div className="flex gap-1">
                    <button
                      onClick={cambiarMesAnterior}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={cambiarMesSiguiente}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMesActual(hoy)}
                    className="px-4 py-1.5 text-sm font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hoy
                  </button>
                  <select className="px-4 py-1.5 text-sm font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 bg-white outline-none cursor-pointer">
                    <option>Mes</option>
                    <option>Semana</option>
                  </select>
                </div>
              </div>

              {/* Días de la semana */}
              <div className="grid grid-cols-7 border-b border-gray-50">
                {diasSemana.map((dia) => (
                  <div
                    key={dia}
                    className="py-3 text-center text-xs font-bold text-gray-400"
                  >
                    {dia}
                  </div>
                ))}
              </div>

              {/* Cuadrícula del mes */}
              <div className="flex-1 grid grid-cols-7 auto-rows-[120px]">
                {diasDelMes.map((dia, idx) => {
                  const esMesActual = isSameMonth(dia, mesActual);
                  const esHoy = isToday(dia);
                  // Buscamos los turnos que caen en este día
                  const turnosDelDia = TURNOS_MOCK.filter((t) =>
                    isSameDay(t.fecha, dia),
                  );

                  return (
                    <div
                      key={dia.toString()}
                      className={`border-b border-r border-gray-50 p-2 flex flex-col gap-1 transition-colors hover:bg-gray-50 cursor-pointer ${
                        !esMesActual ? "bg-gray-50/50" : ""
                      } ${esHoy ? "bg-pink-50/30" : ""}`}
                    >
                      <span
                        className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                          esHoy
                            ? "bg-pink-600 text-white font-bold"
                            : !esMesActual
                              ? "text-gray-300"
                              : "text-gray-700"
                        }`}
                      >
                        {format(dia, "d")}
                      </span>

                      {/* Píldoras de turnos */}
                      <div className="flex-1 overflow-y-auto hide-scrollbar space-y-1 mt-1">
                        {turnosDelDia.map((turno) => (
                          <div
                            key={turno.id}
                            className={`text-[10px] font-bold px-2 py-1 rounded w-full truncate ${turno.color}`}
                          >
                            {turno.hora} - {turno.servicio.split(" ")[0]}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 📊 COLUMNA DERECHA: WIDGETS (30%) */}
            <div className="w-full xl:w-80 flex flex-col gap-6 shrink-0">
              {/* Tarjeta Fucsia (Métricas de Hoy) */}
              <div className="bg-pink-600 rounded-3xl p-6 text-white shadow-lg shadow-pink-600/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
                <h3 className="font-bold text-pink-100 tracking-wider text-sm mb-4">
                  HOY
                </h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-5xl font-black">12</span>
                  <span className="text-xl font-medium text-pink-100">
                    Turnos
                  </span>
                </div>
                <p className="text-sm text-pink-200 mb-8">
                  4 confirmados, 2 por confirmar
                </p>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span>Capacidad del día</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-pink-800/50 h-2 rounded-full overflow-hidden">
                    <div className="bg-white h-full rounded-full w-3/4"></div>
                  </div>
                </div>
              </div>

              {/* Próximos Turnos (Lista lateral) */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1">
                <h3 className="font-bold text-gray-900 mb-6">
                  Próximos Turnos
                </h3>
                <div className="space-y-6">
                  {TURNOS_MOCK.slice(0, 2).map((turno) => (
                    <div key={turno.id} className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold shrink-0">
                        {turno.iniciales}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">
                          {turno.cliente}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {turno.servicio}
                        </p>
                        <p className="text-xs font-bold text-pink-600 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {turno.hora}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-2.5 bg-pink-50 text-pink-600 font-bold rounded-xl text-sm hover:bg-pink-100 transition-colors">
                  Ver todos
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* =========================================
             VISTA 2: LISTADO DETALLADO (TABLA)
             ========================================= */
          <motion.div
            key="lista"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Listado Detallado de Turnos
              </h2>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-gray-400 font-bold border-b border-gray-100">
                    <th className="p-4 pl-6">Cliente</th>
                    <th className="p-4">Servicio</th>
                    <th className="p-4">Horario</th>
                    <th className="p-4">Profesional</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 pr-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {TURNOS_MOCK.map((turno) => (
                    <tr
                      key={turno.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                            {turno.iniciales}
                          </div>
                          <span className="font-medium text-gray-900 text-sm">
                            {turno.cliente}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {turno.servicio}
                      </td>
                      <td className="p-4 font-bold text-gray-900 text-sm">
                        {turno.hora}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {turno.profesional}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full ${
                            turno.estado === "CONFIRMADO"
                              ? "bg-emerald-100 text-emerald-700"
                              : turno.estado === "PENDIENTE"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-pink-100 text-pink-700"
                          }`}
                        >
                          {turno.estado}
                        </span>
                      </td>
                      <td className="p-4 pr-6">
                        <div className="flex items-center justify-end gap-2">
                          {turno.estado === "PENDIENTE" && (
                            <button
                              className="p-1.5 text-emerald-600 border border-emerald-200 hover:bg-emerald-50 rounded-md transition-colors"
                              title="Confirmar"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            className="p-1.5 text-gray-400 border border-gray-200 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                            title="Ver Detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 text-red-500 border border-red-200 hover:bg-red-50 rounded-md transition-colors"
                            title="Cancelar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTurnos;
