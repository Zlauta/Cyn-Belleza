import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  format,
  addDays,
  startOfToday,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";

const SERVICIOS_MOCK = [
  {
    id: 1,
    nombre: "Corte, Color y Tratamientos",
    precio: 65000,
    duracion: "90 min",
    imagen:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=300",
  },
  {
    id: 2,
    nombre: "Uñas Acrílicas",
    precio: 15000,
    duracion: "60 min",
    imagen:
      "https://images.unsplash.com/photo-1604654894610-df490668710d?q=80&w=300",
  },
  {
    id: 3,
    nombre: "Lifting Pestañas",
    precio: 18000,
    duracion: "45 min",
    imagen:
      "https://images.unsplash.com/photo-1583011319767-464a4c16c805?q=80&w=300",
  },
  {
    id: 4,
    nombre: "Maquillaje Social",
    precio: 25000,
    duracion: "60 min",
    imagen:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=300",
  },
];

const HORARIOS_MOCK = [
  "09:00",
  "10:00",
  "11:30",
  "13:00",
  "15:30",
  "17:00",
  "18:30",
];

const Reservar = () => {
  const hoy = startOfToday();
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(hoy);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

  // 👉 NUEVO ESTADO: Para saber qué mes estamos mirando en el calendario
  const [mesActual, setMesActual] = useState(hoy);

  // 👉 LÓGICA DEL CALENDARIO COMPLETO
  const primerDiaDelMes = startOfMonth(mesActual);
  const ultimoDiaDelMes = endOfMonth(mesActual);
  const fechaInicio = startOfWeek(primerDiaDelMes, { weekStartsOn: 1 }); // Empezamos el Lunes
  const fechaFin = endOfWeek(ultimoDiaDelMes, { weekStartsOn: 1 });

  const diasDelMes = eachDayOfInterval({ start: fechaInicio, end: fechaFin });

  const mesAnterior = () => setMesActual(subMonths(mesActual, 1));
  const mesSiguiente = () => setMesActual(addMonths(mesActual, 1));

  const diasSemana = ["L", "M", "M", "J", "V", "S", "D"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans"
    >
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Encabezado */}
        <div>
          <h1 className="text-4xl font-extrabold text-pink-600 mb-2">
            Reserva tu Experiencia
          </h1>
          <p className="text-gray-500 text-lg">
            Personaliza tu cita premium de belleza y bienestar.
          </p>
        </div>

        {/* PASO 1: Servicios */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
              1
            </span>
            <h2 className="text-2xl font-bold text-gray-900">
              Selecciona un Servicio
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SERVICIOS_MOCK.map((srv) => (
              <div
                key={srv.id}
                onClick={() => setServicioSeleccionado(srv)}
                className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  servicioSeleccionado?.id === srv.id
                    ? "border-pink-600 shadow-md ring-2 ring-pink-100"
                    : "border-transparent bg-white shadow-sm hover:shadow-md hover:border-pink-200"
                }`}
              >
                <div className="aspect-square w-full">
                  <img
                    src={srv.imagen}
                    alt={srv.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {srv.nombre}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PASO 2 y 3: Fecha y Hora (Grid de 2 columnas) */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* 👉 COLUMNA FECHA (CALENDARIO COMPLETO) */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                2
              </span>
              <h2 className="text-2xl font-bold text-gray-900">
                Selecciona Fecha
              </h2>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              {/* Controles del Mes */}
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-xl text-gray-900 capitalize">
                  {format(mesActual, "MMMM yyyy", { locale: es })}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={mesAnterior}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={mesSiguiente}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Días de la semana */}
              <div className="grid grid-cols-7 gap-1 text-center mb-4">
                {diasSemana.map((dia) => (
                  <div
                    key={dia}
                    className="text-sm font-semibold text-gray-400"
                  >
                    {dia}
                  </div>
                ))}
              </div>

              {/* Cuadrícula de Días */}
              <div className="grid grid-cols-7 gap-y-2 gap-x-1">
                {diasDelMes.map((dia, idx) => {
                  const esMesActual = isSameMonth(dia, mesActual);
                  const esSeleccionado = isSameDay(dia, fechaSeleccionada);
                  const esPasado = dia < hoy && !isSameDay(dia, hoy);

                  return (
                    <button
                      key={dia.toString()}
                      onClick={() => !esPasado && setFechaSeleccionada(dia)}
                      disabled={esPasado}
                      className={`
                        aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all
                        ${!esMesActual ? "text-gray-300" : "text-gray-700"}
                        ${esSeleccionado ? "bg-pink-600 text-white shadow-md" : ""}
                        ${!esSeleccionado && !esPasado ? "hover:bg-pink-50 hover:text-pink-600" : ""}
                        ${esPasado && !esSeleccionado ? "opacity-40 cursor-not-allowed" : ""}
                      `}
                    >
                      {format(dia, "d")}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* COLUMNA HORARIO */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                3
              </span>
              <h2 className="text-2xl font-bold text-gray-900">
                Horario Disponible
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {HORARIOS_MOCK.map((hora) => (
                <button
                  key={hora}
                  onClick={() => setHorarioSeleccionado(hora)}
                  className={`py-4 px-4 rounded-xl border font-semibold transition-all ${
                    horarioSeleccionado === hora
                      ? "bg-pink-600 border-pink-600 text-white shadow-md"
                      : "bg-white border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600"
                  }`}
                >
                  {hora}
                </button>
              ))}
            </div>
            {servicioSeleccionado && (
              <p className="text-sm text-gray-500 mt-6 flex items-center gap-2 bg-gray-100 p-3 rounded-lg w-fit">
                <Clock className="w-4 h-4 text-pink-600" />
                Duración estimada:{" "}
                <span className="font-semibold">
                  {servicioSeleccionado.duracion}
                </span>
              </p>
            )}
          </section>
        </div>

        {/* RESUMEN FINAL */}
        {servicioSeleccionado && horarioSeleccionado && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-pink-50 border border-pink-100 p-6 md:p-8 rounded-3xl mt-12 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="text-pink-600 w-6 h-6" />
              <h3 className="text-2xl font-bold text-gray-900">
                Resumen de tu Reserva
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-xs text-pink-600 font-bold uppercase tracking-wider mb-1">
                  Servicio
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {servicioSeleccionado.nombre}
                </p>
                <p className="text-gray-600 font-medium mt-1">
                  ${servicioSeleccionado.precio.toLocaleString("es-AR")}
                </p>
              </div>
              <div>
                <p className="text-xs text-pink-600 font-bold uppercase tracking-wider mb-1">
                  Fecha y Hora
                </p>
                <p className="text-xl font-bold text-gray-900 capitalize">
                  {format(fechaSeleccionada, "EEEE, d 'de' MMMM", {
                    locale: es,
                  })}
                </p>
                <p className="text-gray-600 font-medium mt-1">
                  {horarioSeleccionado} hs
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-pink-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-pink-700 hover:shadow-xl transition-all transform hover:-translate-y-1">
                CONFIRMAR RESERVA
              </button>
              <button
                onClick={() => {
                  setServicioSeleccionado(null);
                  setHorarioSeleccionado(null);
                }}
                className="sm:w-1/3 bg-white border-2 border-pink-200 text-pink-600 py-4 rounded-xl font-bold text-lg hover:bg-pink-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
            <p className="text-center text-sm text-gray-500 mt-6">
              Recibirás un email y un mensaje de WhatsApp con la confirmación de
              tu cita.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Reservar;
