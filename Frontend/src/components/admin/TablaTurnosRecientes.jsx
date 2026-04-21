import React, { useState } from "react";
import {
  MoreVertical,
  Check,
  X as CancelIcon,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { actualizarTurno } from "../../services/turno.services.js";

const TablaTurnosRecientes = ({ turnos, setTurnos, navigate }) => {
  const [menuAbiertoId, setMenuAbiertoId] = useState(null);

  const turnosRecientes = [...turnos]
    .sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora))
    .slice(0, 5);

  // 👉 Ahora recibimos el turno completo, no solo el ID
  const handleCambiarEstado = async (turno, nuevoEstado) => {
    // 🔥 REGLA DE NEGOCIO: No se puede completar un turno del futuro
    if (nuevoEstado === "COMPLETADO") {
      const ahora = new Date();
      const fechaDelTurno = new Date(turno.fechaHora);

      if (fechaDelTurno > ahora) {
        toast.error("⏳ No puedes completar un turno que aún no ha sucedido.");
        setMenuAbiertoId(null); // Cerramos el menú
        return; // Cortamos la ejecución acá, no va al backend
      }
    }

    const loadToast = toast.loading("Actualizando estado...");
    try {
      await actualizarTurno(turno.id, { estado: nuevoEstado });
      setTurnos((prev) =>
        prev.map((t) =>
          t.id === turno.id ? { ...t, estado: nuevoEstado } : t,
        ),
      );
      setMenuAbiertoId(null);
      toast.success(`Turno marcado como ${nuevoEstado}`, { id: loadToast });
    } catch (error) {
      toast.error("Error al actualizar el estado", { id: loadToast });
    }
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Últimos movimientos</h2>
        <button
          onClick={() => navigate("/admin/turnos")}
          className="text-sm font-bold text-pink-600 hover:text-pink-700"
        >
          Ver todos los turnos
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-gray-100">
              <th className="p-4 pl-6">Cliente</th>
              <th className="p-4">Servicio</th>
              <th className="p-4">Fecha y Hora</th>
              <th className="p-4">Profesional</th>
              <th className="p-4">Estado</th>
              <th className="p-4 pr-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {turnosRecientes.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  No hay turnos registrados en el sistema.
                </td>
              </tr>
            ) : (
              turnosRecientes.map((turno) => {
                const nombreCliente =
                  turno.cliente?.nombre || turno.clienteManual || "Anónimo";
                const iniciales = nombreCliente.substring(0, 2).toUpperCase();
                const fecha = new Date(turno.fechaHora);

                return (
                  <tr
                    key={turno.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-xs font-bold text-pink-700">
                          {iniciales}
                        </div>
                        <span className="font-bold text-gray-900 text-sm">
                          {nombreCliente}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 font-medium">
                      {turno.servicio?.nombre || "General"}
                    </td>
                    <td className="p-4 text-sm font-bold text-gray-900">
                      {fecha.toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                      })}{" "}
                      -{" "}
                      {fecha.toLocaleTimeString("es-AR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4 text-sm text-gray-400 italic">
                      Cynthia Belleza
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          turno.estado === "CONFIRMADO" ||
                          turno.estado === "COMPLETADO"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : turno.estado === "CANCELADO"
                              ? "bg-red-50 text-red-600 border border-red-100"
                              : "bg-amber-50 text-amber-600 border border-amber-100"
                        }`}
                      >
                        {turno.estado}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-center relative">
                      <button
                        onClick={() =>
                          setMenuAbiertoId(
                            menuAbiertoId === turno.id ? null : turno.id,
                          )
                        }
                        className="hover:text-pink-600 transition-colors p-1"
                      >
                        <MoreVertical className="w-5 h-5 mx-auto text-gray-400" />
                      </button>

                      {menuAbiertoId === turno.id && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setMenuAbiertoId(null)}
                          ></div>
                          <div className="absolute right-16 top-1 w-40 bg-white rounded-xl shadow-xl border border-gray-300 z-50 overflow-hidden py-1">
                            <button
                              onClick={() =>
                                handleCambiarEstado(turno, "CONFIRMADO")
                              }
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-emerald-100 text-gray-700 font-medium"
                            >
                              <Check className="w-4 h-4 text-emerald-500" />{" "}
                              Confirmar
                            </button>
                            <button
                              onClick={() =>
                                handleCambiarEstado(turno, "COMPLETADO")
                              }
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-blue-100 text-blue-600 font-medium"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Completar
                            </button>
                            <div className="h-px bg-gray-200 my-1"></div>
                            <button
                              onClick={() =>
                                handleCambiarEstado(turno, "CANCELADO")
                              }
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-100 text-red-600 font-medium"
                            >
                              <CancelIcon className="w-4 h-4" /> Cancelar
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaTurnosRecientes;
