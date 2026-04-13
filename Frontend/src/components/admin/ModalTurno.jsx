import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { X, Clock, AlertCircle } from "lucide-react";
import { consultarDisponibilidadPublica } from "../../services/reservas.service.js";

const ModalTurno = ({
  abierto,
  cerrar,
  turnoAEditar,
  onSubmitForm,
  servicios = [],
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);

  const servicioId = watch("servicioId");
  const fechaElegida = watch("fecha");
  const horaElegida = watch("hora");

  // --- 1. SETEAR DATOS INICIALES ---
  useEffect(() => {
    if (turnoAEditar) {
      const fechaObj = new Date(turnoAEditar.fechaHora);
      const fechaFormat = fechaObj.toISOString().split("T")[0];

      const horas = String(fechaObj.getHours()).padStart(2, "0");
      const minutos = String(fechaObj.getMinutes()).padStart(2, "0");
      const horaFormat = `${horas}:${minutos}`;

      // 👉 CORRECCIÓN ACÁ: Manejamos el dato venga como venga
      let nombreForm = "";
      if (typeof turnoAEditar.cliente === "string") {
        // Si el padre ya lo formateó ("Nombre - Telefono")
        nombreForm = turnoAEditar.cliente;
      } else if (turnoAEditar.cliente && turnoAEditar.cliente.nombre) {
        // Si viene como objeto directo de la DB
        nombreForm = turnoAEditar.cliente.nombre;
        if (turnoAEditar.cliente.telefono) {
          nombreForm += ` - ${turnoAEditar.cliente.telefono}`;
        }
      } else {
        // Si es un cliente cargado a mano (sin registrarse)
        nombreForm =
          turnoAEditar.clienteManual || turnoAEditar.clienteNoRegistrado || "";
      }

      reset({
        servicioId: turnoAEditar.servicioId,
        fecha: fechaFormat,
        hora: horaFormat,
        estado: turnoAEditar.estado,
        clienteManual: nombreForm, // Llenamos el input con el dato seguro
      });
      setHorariosDisponibles([horaFormat]);
    } else {
      reset({
        servicioId: "",
        fecha: new Date().toISOString().split("T")[0],
        hora: "",
        estado: "PENDIENTE",
        clienteManual: "",
        telefono: "",
      });
      setHorariosDisponibles([]);
    }
  }, [turnoAEditar, abierto, reset]);

  // --- 2. TRAER HUECOS DISPONIBLES ---
  useEffect(() => {
    const cargarHuecos = async () => {
      if (servicioId && fechaElegida && abierto) {
        setCargandoHorarios(true);
        try {
          const slots = await consultarDisponibilidadPublica(
            fechaElegida,
            servicioId,
          );

          if (turnoAEditar && turnoAEditar.servicioId === Number(servicioId)) {
            const fechaOriginal = new Date(turnoAEditar.fechaHora)
              .toISOString()
              .split("T")[0];
            const horas = String(
              new Date(turnoAEditar.fechaHora).getHours(),
            ).padStart(2, "0");
            const minutos = String(
              new Date(turnoAEditar.fechaHora).getMinutes(),
            ).padStart(2, "0");
            const horaOriginal = `${horas}:${minutos}`;

            if (
              fechaElegida === fechaOriginal &&
              !slots.includes(horaOriginal)
            ) {
              slots.push(horaOriginal);
              slots.sort();
            }
          }

          setHorariosDisponibles(slots);

          if (horaElegida && !slots.includes(horaElegida) && !turnoAEditar) {
            setValue("hora", "");
          }
        } catch (error) {
          console.error("Error al cargar horarios", error);
        } finally {
          setCargandoHorarios(false);
        }
      }
    };
    cargarHuecos();
  }, [servicioId, fechaElegida, abierto]);

  const esTurnoFuturo = () => {
    if (!fechaElegida || !horaElegida) return true;
    const fechaHoraCombo = new Date(`${fechaElegida}T${horaElegida}:00`);
    return fechaHoraCombo > new Date();
  };

  return (
    <AnimatePresence>
      {abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrar}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 flex flex-col max-h-[90vh]"
          >
            <div className="p-5 sm:p-6 border-b rounded-3xl border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <h2 className="text-xl font-bold text-gray-900">
                {turnoAEditar ? "Editar Turno" : "Agendar Turno"}
              </h2>
              <button
                type="button"
                onClick={cerrar}
                className="text-gray-400 hover:text-gray-900 bg-white rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 sm:p-6">
              <form
                id="turno-form"
                onSubmit={handleSubmit(onSubmitForm)}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Servicio
                    </label>
                    <select
                      {...register("servicioId", { required: "Obligatorio" })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 outline-none"
                    >
                      <option value="">Seleccionar...</option>
                      {servicios.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nombre} ({s.duracion} min)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Cliente (Nombre/Tel)
                    </label>
                    <input
                      {...register("clienteManual", {
                        required: "Obligatorio",
                      })}
                      type="text"
                      placeholder="Ej: Ana - 3812345678"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Fecha
                    </label>
                    <input
                      {...register("fecha", { required: "Obligatoria" })}
                      type="date"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <Clock className="w-4 h-4 text-pink-500" /> Horario
                    </label>
                    {cargandoHorarios ? (
                      <div className="w-full px-4 py-2 bg-gray-100 text-gray-500 rounded-xl text-sm animate-pulse">
                        Calculando...
                      </div>
                    ) : (
                      <select
                        {...register("hora", { required: "Obligatorio" })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 outline-none bg-white"
                      >
                        <option value="">
                          {horariosDisponibles.length === 0 &&
                          fechaElegida &&
                          servicioId
                            ? "Sin turnos"
                            : "Elegir..."}
                        </option>
                        {horariosDisponibles.map((h) => (
                          <option key={h} value={h}>
                            {h} hs
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {horariosDisponibles.length === 0 &&
                  !cargandoHorarios &&
                  fechaElegida &&
                  servicioId &&
                  !turnoAEditar && (
                    <div className="flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 text-sm">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      No hay lugar suficiente en la agenda.
                    </div>
                  )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    {...register("estado")}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 outline-none"
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="CONFIRMADO">Confirmado</option>
                    <option value="COMPLETADO" disabled={esTurnoFuturo()}>
                      Completado {esTurnoFuturo() ? "(Bloqueado)" : ""}
                    </option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                </div>
              </form>
            </div>

            <div className="p-5 sm:p-6 border-t rounded-3xl border-gray-100 bg-gray-50/50 shrink-0 flex gap-3">
              <button
                type="button"
                onClick={cerrar}
                className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                form="turno-form"
                type="submit"
                disabled={horariosDisponibles.length === 0 && !turnoAEditar}
                className="flex-1 py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 disabled:opacity-50"
              >
                {turnoAEditar ? "Guardar Cambios" : "Agendar"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ModalTurno;