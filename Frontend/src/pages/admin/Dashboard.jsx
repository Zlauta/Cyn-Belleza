import React from "react";
import { Scissors, Sparkles, UserPlus, Eye, MoreVertical } from "lucide-react";

const METRICAS_MOCK = [
  {
    id: 1,
    titulo: "Peluquería",
    turnos: 12,
    ingresos: 45200,
    icon: Scissors,
    color: "text-pink-600",
    bg: "bg-pink-100",
    trend: "+12.5%",
  },
  {
    id: 2,
    titulo: "Uñas",
    turnos: 8,
    ingresos: 22800,
    icon: Sparkles,
    color: "text-purple-600",
    bg: "bg-purple-100",
    trend: "+8.2%",
  },
  {
    id: 3,
    titulo: "Pestañas",
    turnos: 5,
    ingresos: 18500,
    icon: Eye,
    color: "text-rose-600",
    bg: "bg-rose-100",
    trend: "-2.4%",
    negativo: true,
  },
  {
    id: 4,
    titulo: "Barbería",
    turnos: 10,
    ingresos: 31400,
    icon: UserPlus,
    color: "text-pink-500",
    bg: "bg-pink-50",
    trend: "+15.1%",
  },
];

const TURNOS_RECIENTES_MOCK = [
  {
    id: 1,
    cliente: "Ana García",
    iniciales: "AG",
    servicio: "Corte & Brushing",
    hora: "09:00 AM",
    profesional: "Marta S.",
    estado: "CONFIRMADO",
  },
  {
    id: 2,
    cliente: "Luis Pérez",
    iniciales: "LP",
    servicio: "Barba & Spa",
    hora: "10:30 AM",
    profesional: "Jorge R.",
    estado: "PENDIENTE",
  },
  {
    id: 3,
    cliente: "Marta Soler",
    iniciales: "MS",
    servicio: "Manicura Completa",
    hora: "11:00 AM",
    profesional: "Lucía M.",
    estado: "CONFIRMADO",
  },
  {
    id: 4,
    cliente: "Sofía Luna",
    iniciales: "SL",
    servicio: "Extensión Pestañas",
    hora: "12:00 PM",
    profesional: "Karina P.",
    estado: "CONFIRMADO",
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Panel de Control
          </h1>
          <p className="text-gray-500 mt-1">
            Bienvenida, esto es lo que está pasando hoy en el salón.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-pink-200 text-pink-600 rounded-lg font-bold hover:bg-pink-50 transition-colors shadow-sm">
            + Agregar Usuario
          </button>
          <button className="px-4 py-2 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 transition-colors shadow-md shadow-pink-200">
            + Nuevo Turno
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {METRICAS_MOCK.map((metrica) => {
          const Icono = metrica.icon;
          return (
            <div
              key={metrica.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${metrica.bg}`}
                >
                  <Icono className={`w-6 h-6 ${metrica.color}`} />
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${metrica.negativo ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}
                >
                  {metrica.trend}
                </span>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  {metrica.titulo}
                </p>
                <div className="flex items-baseline gap-2 mb-2">
                  <h3 className="text-2xl font-black text-gray-900">
                    {metrica.turnos} Turnos
                  </h3>
                  <span className="text-sm text-gray-400 font-medium">Hoy</span>
                </div>
                <p className="text-sm text-gray-500">
                  Ingresos:{" "}
                  <span className="font-bold text-gray-900">
                    ${metrica.ingresos.toLocaleString("es-AR")}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabla de Turnos Recientes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Turnos Recientes</h2>
          <button className="text-sm font-bold text-pink-600 hover:text-pink-700">
            Ver todos los turnos
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-gray-100">
                <th className="p-4 pl-6">Cliente</th>
                <th className="p-4">Servicio</th>
                <th className="p-4">Hora</th>
                <th className="p-4">Profesional</th>
                <th className="p-4">Estado</th>
                <th className="p-4 pr-6">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {TURNOS_RECIENTES_MOCK.map((turno) => (
                <tr
                  key={turno.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                        {turno.iniciales}
                      </div>
                      <span className="font-bold text-gray-900 text-sm">
                        {turno.cliente}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {turno.servicio}
                  </td>
                  <td className="p-4 text-sm font-bold text-gray-900">
                    {turno.hora}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {turno.profesional}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        turno.estado === "CONFIRMADO"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}
                    >
                      {turno.estado}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-gray-400">
                    <button className="hover:text-pink-600 transition-colors p-1">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
