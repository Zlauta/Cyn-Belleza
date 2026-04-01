import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { format, addMonths } from "date-fns";
import { obtenerServicios } from "../../services/servicio.service.js";
// 👉 Asegurate de tener este archivo creado en tus services
import { obtenerUsuarios } from "../../services/auth.services.js";

const ModalTurno = ({ abierto, cerrar, turnoAEditar, onSubmitForm }) => {
  const { register, handleSubmit, reset, watch } = useForm();

  // 👉 ESTADOS PARA GUARDAR LO QUE VIENE DE LA BASE DE DATOS
  const [listaServicios, setListaServicios] = useState([]);
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [esClienteManual, setEsClienteManual] = useState(false);

  const fechaElegida = watch("fecha");
  const horaElegida = watch("hora");

  // 3. Calculamos si el turno es a futuro
  const esTurnoFuturo = () => {
    if (!fechaElegida || !horaElegida) return true;
    const fechaHoraCombo = new Date(`${fechaElegida}T${horaElegida}:00`);
    return fechaHoraCombo > new Date();
  };

  const hoyStr = format(new Date(), "yyyy-MM-dd");
  const maxMeseStr = format(addMonths(new Date(), 2), "yyyy-MM-dd");

  // 👉 AL ABRIR EL COMPONENTE, BUSCAMOS SERVICIOS Y USUARIOS
  useEffect(() => {
    obtenerServicios().then((data) => {
      // Extraemos el array seguro para servicios
      const arrayServicios = Array.isArray(data) ? data : data?.datos || [];
      setListaServicios(
        arrayServicios.filter(
          (s) => s.estado === "Activo" || s.activo === true,
        ),
      );
    });

    obtenerUsuarios().then((data) => {
      // 👉 BÚSQUEDA INTELIGENTE: Buscamos el array venga como venga
      const arrayUsuarios = Array.isArray(data)
        ? data
        : data?.datos || data?.usuarios || [];
      setListaUsuarios(arrayUsuarios);
    });
  }, []);

  // 👉 PREPARAMOS EL FORMULARIO (NUEVO O EDITAR)
  useEffect(() => {
    if (turnoAEditar) {
      const fechaFormateada =
        typeof turnoAEditar.fecha === "string"
          ? turnoAEditar.fecha.split("T")[0]
          : format(
              new Date(turnoAEditar.fechaObj || turnoAEditar.fechaHora),
              "yyyy-MM-dd",
            );

      const horaFormateada =
        typeof turnoAEditar.hora === "string"
          ? turnoAEditar.hora
          : format(
              new Date(turnoAEditar.fechaObj || turnoAEditar.fechaHora),
              "HH:mm",
            );

      // Si el turno a editar tiene un nombre manual, activamos el switch de "Doña Rosa"
      const tieneNombreManual = !!turnoAEditar.clienteManual;
      setEsClienteManual(tieneNombreManual);

      reset({
        ...turnoAEditar,
        fecha: fechaFormateada,
        hora: horaFormateada,
        clienteId: turnoAEditar.clienteId || "",
        clienteManual: turnoAEditar.clienteManual || "",
        servicioId: turnoAEditar.servicioId || "",
      });
    } else {
      setEsClienteManual(false); // Por defecto mostramos la lista desplegable
      reset({
        clienteId: "",
        clienteManual: "",
        servicioId: "",
        fecha: hoyStr,
        hora: "10:00",
        estado: "PENDIENTE",
      });
    }
  }, [turnoAEditar, abierto, reset, hoyStr]);

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
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">
                {turnoAEditar ? "Editar Turno" : "Agendar Nuevo Turno"}
              </h2>
              <button
                onClick={cerrar}
                className="text-gray-400 hover:text-gray-900 bg-white rounded-full p-1 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmitForm)}
              className="p-6 space-y-4"
            >
              {/* 👉 SELECTOR DE TIPO DE CLIENTE */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-gray-700">
                    Asignar Cliente
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setEsClienteManual(!esClienteManual);
                      // Limpiamos los campos al cambiar de modo para que no se mezclen
                      reset((formValues) => ({
                        ...formValues,
                        clienteId: "",
                        clienteManual: "",
                      }));
                    }}
                    className="text-xs font-bold text-pink-600 hover:text-pink-700 underline"
                  >
                    {esClienteManual
                      ? "Elegir de la lista"
                      : "Escribir nombre manual"}
                  </button>
                </div>

                {esClienteManual ? (
                  <input
                    {...register("clienteManual")}
                    type="text"
                    placeholder="Ej: Doña Rosa (Tel: 381-1234567)"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500 bg-white"
                  />
                ) : (
                  <select
                    {...register("clienteId")}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500 bg-white"
                  >
                    <option value="">Seleccionar cliente registrado...</option>
                    {listaUsuarios
                      .filter((u) => u.rol !== "ADMIN")
                      .map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.nombre}
                        </option>
                      ))}
                  </select>
                )}
              </div>

              {/* 👉 SERVICIO */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Servicio
                </label>
                <select
                  {...register("servicioId", { required: true })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500 bg-white"
                >
                  <option value="">Seleccionar...</option>
                  {listaServicios.map((serv) => (
                    <option key={serv.id} value={serv.id}>
                      {serv.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Fecha
                  </label>
                  <input
                    {...register("fecha", { required: true })}
                    type="date"
                    min={hoyStr}
                    max={maxMeseStr}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Hora
                  </label>
                  <input
                    {...register("hora", { required: true })}
                    type="time"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  {...register("estado")}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500 bg-white"
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="CONFIRMADO">Confirmado</option>

                  {/* 👉 DESHABILITADO SI ES FUTURO */}
                  <option value="COMPLETADO" disabled={esTurnoFuturo()}>
                    Completado{" "}
                  </option>

                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={cerrar}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-pink-600 text-white font-bold rounded-xl shadow-md hover:bg-pink-700 transition-colors"
                >
                  {turnoAEditar ? "Guardar Cambios" : "Confirmar Turno"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ModalTurno;
