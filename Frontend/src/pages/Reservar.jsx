import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, CheckCircle } from "lucide-react";
import { format, addDays, startOfToday } from "date-fns";
import { es } from "date-fns/locale"; // Para tener los meses en español

// Datos simulados (Luego vendrán de tu base de datos)
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
  // Estados para guardar lo que elige el usuario
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(startOfToday());
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

  // Generamos los próximos 7 días para el calendario rápido
  const proximosDias = Array.from({ length: 7 }).map((_, i) =>
    addDays(startOfToday(), i),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans"
    >
      <div className="max-w-4xl mx-auto space-y-12">
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
                    : "border-transparent bg-white shadow-sm hover:shadow-md"
                }`}
              >
                <div className="aspect-square w-full">
                  <img
                    src={srv.imagen}
                    alt={srv.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {srv.nombre}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PASO 2 y 3: Fecha y Hora (Grid de 2 columnas en desktop) */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Columna Fecha */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                2
              </span>
              <h2 className="text-2xl font-bold text-gray-900">
                Selecciona Fecha
              </h2>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg capitalize">
                  {format(fechaSeleccionada, "MMMM yyyy", { locale: es })}
                </h3>
                <CalendarIcon className="text-pink-600 w-5 h-5" />
              </div>

              <div className="grid grid-cols-7 gap-2">
                {proximosDias.map((dia, idx) => {
                  const esSeleccionado =
                    format(dia, "yyyy-MM-dd") ===
                    format(fechaSeleccionada, "yyyy-MM-dd");
                  return (
                    <div
                      key={idx}
                      onClick={() => setFechaSeleccionada(dia)}
                      className={`flex flex-col items-center p-2 rounded-xl cursor-pointer transition-colors ${
                        esSeleccionado
                          ? "bg-pink-600 text-white font-bold shadow-sm"
                          : "hover:bg-pink-50 text-gray-600"
                      }`}
                    >
                      <span className="text-xs mb-1 uppercase">
                        {format(dia, "EE", { locale: es })}
                      </span>
                      <span className="text-lg">{format(dia, "d")}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Columna Horario */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                3
              </span>
              <h2 className="text-2xl font-bold text-gray-900">
                Horario Disponible
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {HORARIOS_MOCK.map((hora) => (
                <button
                  key={hora}
                  onClick={() => setHorarioSeleccionado(hora)}
                  className={`py-3 px-4 rounded-xl border font-medium transition-all ${
                    horarioSeleccionado === hora
                      ? "bg-pink-600 border-pink-600 text-white shadow-md"
                      : "bg-white border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50"
                  }`}
                >
                  {hora}
                </button>
              ))}
            </div>
            {servicioSeleccionado && (
              <p className="text-sm text-gray-400 mt-4 italic flex items-center gap-1">
                <Clock className="w-4 h-4" /> Duración estimada:{" "}
                {servicioSeleccionado.duracion}
              </p>
            )}
          </section>
        </div>

        {/* RESUMEN FINAL */}
        {servicioSeleccionado && horarioSeleccionado && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-pink-50 border border-pink-100 p-6 md:p-8 rounded-3xl mt-12"
          >
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="text-pink-600 w-6 h-6" />
              <h3 className="text-2xl font-bold text-gray-900">
                Resumen de tu Reserva
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">
                  Servicio
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {servicioSeleccionado.nombre}
                </p>
                <p className="text-pink-600 font-bold mt-1">
                  ${servicioSeleccionado.precio.toLocaleString("es-AR")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">
                  Fecha y Hora
                </p>
                <p className="text-lg font-bold text-gray-900 capitalize">
                  {format(fechaSeleccionada, "EEEE, d 'de' MMMM", {
                    locale: es,
                  })}
                </p>
                <p className="text-gray-700 mt-1">{horarioSeleccionado} hs</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-pink-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-pink-700 transition-colors">
                CONFIRMAR RESERVA
              </button>
              <button
                onClick={() => {
                  setServicioSeleccionado(null);
                  setHorarioSeleccionado(null);
                }}
                className="sm:w-1/3 bg-transparent border-2 border-pink-200 text-pink-600 py-4 rounded-xl font-bold text-lg hover:bg-pink-100 transition-colors"
              >
                Cancelar
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">
              Recibirás un email con la confirmación de tu cita.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Reservar;
