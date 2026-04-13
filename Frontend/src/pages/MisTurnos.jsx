import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  XCircle,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  obtenerMisTurnosService,
  cancelarTurnoService,
} from "../services/turno.services.js";

const MisTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const NUMERO_WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER ;

  // 👉 useEffect Corregido: Carga inicial y suscripción a eventos de actualización
  useEffect(() => {
    const cargarTurnos = async () => {
      try {
        const datos = await obtenerMisTurnosService();
        setTurnos(datos || []);
      } catch (error) {
        // Tu manejador 'atraparError' ya se encarga de procesarlo en el service
        toast.error("No pudimos actualizar tus turnos.");
      } finally {
        setCargando(false);
      }
    };

    cargarTurnos();

    // Escuchamos cambios (por si reserva un turno nuevo en otra pestaña)
    window.addEventListener("storage", cargarTurnos);
    return () => window.removeEventListener("storage", cargarTurnos);
  }, []);

  const ejecutarCancelacion = async (id, toastId) => {
    toast.dismiss(toastId);
    const loadToast = toast.loading("Procesando cancelación...");

    try {
      await cancelarTurnoService(id);
      setTurnos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, estado: "CANCELADO" } : t)),
      );
      window.dispatchEvent(new Event("storage"));
      toast.success("Turno cancelado. La seña queda a tu favor.");
    } catch (error) {
      // El error ya viene procesado por tu handlerError.js
      toast.error(error.message || "Error al cancelar");
    } finally {
      toast.dismiss(loadToast);
    }
  };

  const handleCancelar = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-gray-800">
            ¿Estás segura? La seña se guardará para tu próxima visita.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-xs font-bold px-3 py-1.5 bg-gray-100 rounded-lg"
            >
              No, mantener
            </button>
            <button
              onClick={() => ejecutarCancelacion(id, t.id)}
              className="text-xs font-bold px-3 py-1.5 bg-red-600 text-white rounded-lg"
            >
              Sí, cancelar
            </button>
          </div>
        </div>
      ),
      { duration: 6000, id: `confirm-${id}` },
    );
  };

  // 👉 Lógica de filtrado dinámico: Solo estados activos y fechas futuras
  const turnosActivos = turnos.filter((t) => {
    const esFuturo = new Date(t.fechaHora) > new Date();
    const esEstadoValido =
      t.estado !== "CANCELADO" && t.estado !== "FINALIZADO";
    return esFuturo && esEstadoValido;
  });

  if (cargando)
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Mis Turnos ✨</h2>

      {turnosActivos.length === 0 ? (
        <div className="bg-gray-50 rounded-3xl p-12 text-center border border-dashed border-gray-200">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">
            No tenés turnos pendientes para los próximos días.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <AnimatePresence>
            {turnosActivos.map((turno) => {
              const fecha = new Date(turno.fechaHora);
              const faltanMenosDe24hs = fecha.getTime() - Date.now() < 86400000;
              const linkWa = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(`Hola! Necesito cancelar mi turno de ${turno.servicio?.nombre} del ${fecha.toLocaleDateString()} me surgió un imprevisto, gracias!`)}`;

              return (
                <motion.div
                  key={turno.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden"
                >
                  <div
                    className={`absolute top-0 left-0 w-full h-1 ${turno.estado === "CONFIRMADO" ? "bg-green-500" : "bg-pink-500"}`}
                  />

                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {turno.servicio?.nombre}
                    </h3>
                    <p className="font-black text-pink-600">
                      ${turno.servicio?.precio}
                    </p>
                  </div>

                  <div className="space-y-2 mb-6 text-gray-600 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-pink-500" />
                      <span className="capitalize">
                        {fecha.toLocaleDateString("es-AR", {
                          weekday: "long",
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-pink-500" />
                      <span>
                        {fecha.toLocaleTimeString("es-AR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        hs
                      </span>
                    </div>
                  </div>

                  {faltanMenosDe24hs ? (
                    <>
                      <p className="text-red-500 font-medium mb-4">
                        <AlertCircle className="w-5 h-5 text-red-500 inline mr-2" />
                        Solo puedes cancelar turnos con más de 24 horas de
                        anticipación.
                      </p>
                      <a
                        href={linkWa}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center py-2 bg-green-50 text-green-700 rounded-xl font-bold text-sm border border-green-200 hover:bg-green-100 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" /> Consultar
                        Cancelación
                      </a>
                    </>
                  ) : (
                    <button
                      onClick={() => handleCancelar(turno.id)}
                      className="w-full flex items-center justify-center py-2 text-red-500 rounded-xl font-bold text-sm border border-red-100 hover:bg-red-50 transition-colors"
                    >
                      <XCircle className="w-4 h-4 mr-2" /> Cancelar Turno
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MisTurnos;
