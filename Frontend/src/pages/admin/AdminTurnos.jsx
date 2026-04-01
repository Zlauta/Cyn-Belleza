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
  eliminarTurnoService,
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

        const nombreCliente = t.cliente?.nombre || t.clienteManual || 'Cliente Anónimo';
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

    // Frenamos si los dos están vacíos
    if (!data.clienteId && !data.clienteManual) {
      toast.error("⚠️ Debes asignar un cliente (registrado o manual).");
      return;
    }

    const fechaHoraUnida = new Date(`${data.fecha}T${data.hora}:00`);

    const payload = {
      clienteId: data.clienteId ? Number(data.clienteId) : undefined,
      clienteManual: data.clienteManual || undefined, // 👉 Mandamos el manual
      estado: data.estado,
      servicioId: Number(data.servicioId),
      fechaHora: fechaHoraUnida.toISOString()
    };

    console.log("🚀 PAQUETE QUE SALE DE REACT:", payload);
    const loadToast = toast.loading(turnoAEditar ? 'Actualizando...' : 'Agendando...');
    
    try {
      if (turnoAEditar) {
        await actualizarTurno(turnoAEditar.id, payload);
      } else {
        await crearTurno(payload);
      }
      setModalAbierto(false);
      cargarDatos();
      toast.success('¡Operación exitosa!', { id: loadToast });
    } catch (error) {
      toast.error(error.message, { id: loadToast });
    }
  };

  const confirmarEliminacion = async () => {
    if (!turnoAEliminar) return;

    const { id, nombre } = turnoAEliminar;
    const loadToast = toast.loading("Eliminando registro...");

    try {
      // Llamamos al DELETE del backend
      await eliminarTurnoService(id);

      toast.success(`${nombre} eliminado permanentemente`, { id: loadToast });

      // 👉 REGLA DE ORO: Si se borró de la DB, se borra del estado de React
      setTurnos(turnos.filter((t) => t.id !== id));

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
