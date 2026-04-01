import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { CalendarDays, List, Plus } from "lucide-react";
import { format, startOfMonth, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import {
  obtenerTurnos,
  crearTurno,
  actualizarTurno,
  cancelarTurnoService,
} from "../../services/turno.services.js";

// 👉 Importamos los componentes hijos
import ModalTurno from "../../components/admin/ModalTurno.jsx";
import ModalConfirmacion from "../../components/admin/ModalConfirmacion.jsx";
import VistaCalendarioTurnos from "../../components/admin/VistaCalendarioTurnos.jsx";
import VistaListaTurnos from "../../components/admin/VistaListaTurnos.jsx";

const AdminTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [vista, setVista] = useState("calendario");
  const [mesActual, setMesActual] = useState(startOfMonth(new Date()));

  const [modalAbierto, setModalAbierto] = useState(false);
  const [turnoAEditar, setTurnoAEditar] = useState(null);
  const [turnoAEliminar, setTurnoAEliminar] = useState(null);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const data = await obtenerTurnos();

      const turnosProcesados = (data || []).map((t) => {
        // 1. Parseamos la fecha ISO del backend
        const fechaObj = t.fechaHora ? parseISO(t.fechaHora) : new Date();

        // 2. Extraemos los textos de adentro de los objetos (con fallback por si vienen vacíos)
        const nombreCliente = t.cliente?.nombre || "Cliente Anónimo";
        const nombreServicio = t.servicio?.nombre || "Servicio";

        // 3. Extraemos la hora para mostrar en la pastillita y la tabla
        const horaFormateada = format(fechaObj, "HH:mm");

        return {
          ...t,
          fechaObj, // El objeto fecha para el calendario
          hora: horaFormateada, // "15:30"
          cliente: nombreCliente, // "Cinthia Brandan" (Pisamos el objeto con el string)
          servicio: nombreServicio, // "Corte y Brashing" (Pisamos el objeto con el string)
          // Generamos las iniciales con el nombre que acabamos de extraer
          iniciales: nombreCliente
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase(),
        };
      });

      setTurnos(turnosProcesados);
    } catch (error) {
      toast.error("Error al cargar la agenda: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const abrirModalEditar = (turno) => {
    setTurnoAEditar(turno);
    setModalAbierto(true);
  };

  const solicitarCancelacion = (id, nombre) => {
    setTurnoAEliminar({ id, nombre });
  };

  const onSubmitForm = async (data) => {
    // 1. Unimos la Fecha y la Hora SIEMPRE (tanto para crear como para editar)
    const fechaHoraUnida = new Date(`${data.fecha}T${data.hora}:00`);

    // 2. Armamos el paquete completo
    const payload = {
      cliente: data.cliente,
      profesional: data.profesional,
      estado: data.estado,
      servicioId: Number(data.servicioId),
      fechaHora: fechaHoraUnida.toISOString(),
    };

    const loadToast = toast.loading(
      turnoAEditar ? "Actualizando turno..." : "Agendando...",
    );

    try {
      if (turnoAEditar) {
        // 👉 Usamos la función genérica que manda el payload completo
        await actualizarTurno(turnoAEditar.id, payload);
        toast.success("Turno actualizado por completo", { id: loadToast });
      } else {
        await crearTurno(payload);
        toast.success("Turno agendado", { id: loadToast });
      }

      setModalAbierto(false);
      cargarDatos();
    } catch (error) {
      toast.error(error.message, { id: loadToast });
    }
  };

  const confirmarEliminacion = async () => {
    if (!turnoAEliminar) return;
    const loadToast = toast.loading("Cancelando turno...");
    try {
      // 👉 Usamos el nuevo servicio
      await cancelarTurnoService(turnoAEliminar.id);

      toast.success("Turno cancelado", { id: loadToast });
      setTurnos(
        turnos.map((t) =>
          t.id === turnoAEliminar.id ? { ...t, estado: "CANCELADO" } : t,
        ),
      );
      setTurnoAEliminar(null);
    } catch (error) {
      toast.error(error.message, { id: loadToast });
      setTurnoAEliminar(null);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Gestión de Turnos
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Organiza la agenda para hoy,{" "}
            {format(new Date(), "d 'de' MMMM", { locale: es })}.
          </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex-1 sm:flex-none">
            <button
              onClick={() => setVista("calendario")}
              className={`flex-1 flex justify-center items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${vista === "calendario" ? "bg-pink-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
            >
              <CalendarDays className="w-4 h-4" />{" "}
              <span className="hidden sm:inline">Calendario</span>
            </button>
            <button
              onClick={() => setVista("lista")}
              className={`flex-1 flex justify-center items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${vista === "lista" ? "bg-pink-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
            >
              <List className="w-4 h-4" />{" "}
              <span className="hidden sm:inline">Lista</span>
            </button>
          </div>
          <button
            onClick={() => {
              setTurnoAEditar(null);
              setModalAbierto(true);
            }}
            className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-xl font-bold shadow-md hover:bg-pink-700 shrink-0"
          >
            <Plus className="w-5 h-5" />{" "}
            <span className="hidden sm:inline">Nuevo Turno</span>
          </button>
        </div>
      </div>

      {cargando ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {vista === "calendario" ? (
            <VistaCalendarioTurnos
              turnos={turnos}
              mesActual={mesActual}
              setMesActual={setMesActual}
              abrirModalEditar={abrirModalEditar}
            />
          ) : (
            <VistaListaTurnos
              turnos={turnos}
              abrirModalEditar={abrirModalEditar}
              solicitarCancelacion={solicitarCancelacion}
            />
          )}
        </AnimatePresence>
      )}

      <ModalTurno
        abierto={modalAbierto}
        cerrar={() => setModalAbierto(false)}
        turnoAEditar={turnoAEditar}
        onSubmitForm={onSubmitForm}
      />

      <ModalConfirmacion
        abierto={!!turnoAEliminar}
        cerrar={() => setTurnoAEliminar(null)}
        confirmar={confirmarEliminacion}
        titulo="¿Cancelar Turno?"
        mensaje={`Vas a cancelar el ${turnoAEliminar?.nombre}. ¿Estás seguro?`}
      />
    </div>
  );
};

export default AdminTurnos;
