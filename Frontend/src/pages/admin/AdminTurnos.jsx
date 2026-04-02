import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  LayoutGrid,
  List,
  Calendar as CalendarIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  obtenerTurnos,
  crearTurno,
  actualizarTurno,
  eliminarTurnoService,
} from "../../services/turno.services.js";
import { obtenerServicios } from "../../services/servicio.service.js";

import ModalTurno from "../../components/admin/ModalTurno.jsx";
import VistaCalendarioTurnos from "../../components/admin/VistaCalendarioTurnos.jsx";

const AdminTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [serviciosActivos, setServiciosActivos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const [vista, setVista] = useState("calendario");
  const [mesActual, setMesActual] = useState(new Date());

  const [modalAbierto, setModalAbierto] = useState(false);
  const [turnoAEditar, setTurnoAEditar] = useState(null);
  const [confirmacionAbierta, setConfirmacionAbierta] = useState(false);
  const [turnoAEliminar, setTurnoAEliminar] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [turnosData, serviciosData] = await Promise.all([
        obtenerTurnos(),
        obtenerServicios(),
      ]);
      setTurnos(turnosData || []);
      setServiciosActivos(serviciosData || []);
    } catch (error) {
      toast.error("Error al cargar la información de la agenda.");
    } finally {
      setCargando(false);
    }
  };

  const handleAbrirModal = (turno = null) => {
    setTurnoAEditar(turno);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setTurnoAEditar(null);
    setModalAbierto(false);
  };

  const onSubmitForm = async (data) => {
    const loadToast = toast.loading(
      turnoAEditar ? "Actualizando turno..." : "Agendando turno...",
    );
    const fechaHoraUnida = new Date(`${data.fecha}T${data.hora}:00`);

    const payload = {
      servicioId: Number(data.servicioId),
      fechaHora: fechaHoraUnida.toISOString(),
      estado: data.estado,
      clienteManual: data.clienteManual,
    };

    try {
      if (turnoAEditar) {
        await actualizarTurno(turnoAEditar.id, payload);
        toast.success("Turno actualizado", { id: loadToast });
      } else {
        await crearTurno(payload);
        toast.success("Turno agendado", { id: loadToast });
      }
      handleCerrarModal();
      cargarDatos();
    } catch (error) {
      toast.error("Error al guardar el turno", { id: loadToast });
    }
  };

  const ejecutarEliminacion = async () => {
    if (!turnoAEliminar) return;
    const loadToast = toast.loading("Eliminando turno...");
    try {
      await eliminarTurnoService(turnoAEliminar.id);
      toast.success("Turno eliminado correctamente", { id: loadToast });
      setTurnos((prev) => prev.filter((t) => t.id !== turnoAEliminar.id));
      setConfirmacionAbierta(false);
      setTurnoAEliminar(null);
    } catch (error) {
      toast.error("No se pudo eliminar el turno", { id: loadToast });
    }
  };

  // 👉 MAGIA ACÁ: Unificamos Nombre + Teléfono para que Cynthia lo vea en toda la app
  const turnosPreparados = turnos
    .map((t) => {
      const d = new Date(t.fechaHora);

      let infoCliente = "Anónimo";
      if (t.cliente) {
        infoCliente = t.cliente.nombre;
        if (t.cliente.telefono) infoCliente += ` - ${t.cliente.telefono}`;
      } else if (t.clienteManual) {
        infoCliente = t.clienteManual;
      }

      return {
        ...t,
        fechaObj: d,
        hora: d.toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        cliente: infoCliente,
      };
    })
    .filter((t) => t.cliente.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div className="p-4 sm:p-6 overflow-x-hidden">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Agenda de Turnos</h1>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between gap-4 items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por cliente o teléfono..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setVista("tabla")}
              className={`p-2 rounded-md transition-colors ${vista === "tabla" ? "bg-white shadow-sm text-pink-600" : "text-gray-500"}`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setVista("calendario")}
              className={`p-2 rounded-md transition-colors ${vista === "calendario" ? "bg-white shadow-sm text-pink-600" : "text-gray-500"}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => handleAbrirModal()}
            className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-colors"
          >
            <Plus className="w-5 h-5" />{" "}
            <span className="hidden sm:inline">Nuevo Turno</span>
          </button>
        </div>
      </div>

      {cargando ? (
        <div className="p-10 text-center text-gray-500 font-medium">
          Cargando agenda...
        </div>
      ) : (
        <>
          {vista === "calendario" ? (
            <VistaCalendarioTurnos
              turnos={turnosPreparados}
              mesActual={mesActual}
              setMesActual={setMesActual}
              abrirModalEditar={handleAbrirModal}
            />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                    <th className="p-4 font-semibold">Cliente (y Teléfono)</th>
                    <th className="p-4 font-semibold">Servicio</th>
                    <th className="p-4 font-semibold">Fecha y Hora</th>
                    <th className="p-4 font-semibold">Estado</th>
                    <th className="p-4 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {turnosPreparados.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50"
                    >
                      <td className="p-4 font-bold text-gray-900">
                        {t.cliente}
                      </td>
                      <td className="p-4 text-gray-600">
                        {t.servicio?.nombre}
                      </td>
                      <td className="p-4 font-medium text-gray-800">
                        <CalendarIcon className="w-4 h-4 text-pink-500 inline mr-1" />
                        {t.fechaObj.toLocaleDateString("es-AR")} - {t.hora} hs
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${t.estado === "PENDIENTE" ? "bg-amber-100 text-amber-700" : "bg-pink-100 text-pink-700"}`}
                        >
                          {t.estado}
                        </span>
                      </td>
                      <td className="p-4 flex justify-end gap-2">
                        <button
                          onClick={() => handleAbrirModal(t)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setTurnoAEliminar(t);
                            setConfirmacionAbierta(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <ModalTurno
        abierto={modalAbierto}
        cerrar={handleCerrarModal}
        turnoAEditar={turnoAEditar}
        onSubmitForm={onSubmitForm}
        servicios={serviciosActivos}
      />

      <AnimatePresence>
        {confirmacionAbierta && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-sm"
            >
              <h3 className="text-xl font-bold mb-2">¿Eliminar turno?</h3>
              <p className="text-gray-500 mb-6">Se borrará permanentemente.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmacionAbierta(false)}
                  className="flex-1 py-3 bg-gray-100 font-bold rounded-xl hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={ejecutarEliminacion}
                  className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTurnos;
