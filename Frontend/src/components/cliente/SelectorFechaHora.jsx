import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
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
} from "date-fns";
import { es } from "date-fns/locale";

const SelectorFechaHora = ({
  fechaSeleccionada,
  setFechaSeleccionada,
  horarioSeleccionado,
  setHorarioSeleccionado,
  horariosDisponibles,
  servicioSeleccionado,
  hoy,
}) => {
  const [mesActual, setMesActual] = useState(hoy);

  const primerDiaDelMes = startOfMonth(mesActual);
  const ultimoDiaDelMes = endOfMonth(mesActual);
  const fechaInicio = startOfWeek(primerDiaDelMes, { weekStartsOn: 1 });
  const fechaFin = endOfWeek(ultimoDiaDelMes, { weekStartsOn: 1 });
  const diasDelMes = eachDayOfInterval({ start: fechaInicio, end: fechaFin });

  const diasSemana = ["L", "M", "M", "J", "V", "S", "D"];

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      {/* COLUMNA FECHA */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
            2
          </span>
          <h2 className="text-2xl font-bold text-gray-900">Selecciona Fecha</h2>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-xl text-gray-900 capitalize">
              {format(mesActual, "MMMM yyyy", { locale: es })}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setMesActual(subMonths(mesActual, 1))}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setMesActual(addMonths(mesActual, 1))}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-4">
            {diasSemana.map((dia) => (
              <div key={dia} className="text-sm font-semibold text-gray-400">
                {dia}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-2 gap-x-1">
            {diasDelMes.map((dia) => {
              const esMesActual = isSameMonth(dia, mesActual);
              const esSeleccionado = isSameDay(dia, fechaSeleccionada);
              const esPasado = dia < hoy && !isSameDay(dia, hoy);

              return (
                <button
                  key={dia.toString()}
                  onClick={() => !esPasado && setFechaSeleccionada(dia)}
                  disabled={esPasado}
                  className={`aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all
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
          {horariosDisponibles.map((hora) => (
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
            <Clock className="w-4 h-4 text-pink-600" /> Duración estimada:{" "}
            <span className="font-semibold">
              {servicioSeleccionado.duracion}
            </span>
          </p>
        )}
      </section>
    </div>
  );
};

export default SelectorFechaHora;