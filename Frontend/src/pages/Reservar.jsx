import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { startOfToday } from "date-fns";
import { toast } from "react-hot-toast";
import SelectorServicios from "../components/cliente/SelectorServicios.jsx";
import SelectorFechaHora from "../components/cliente/SelectorFechaHora.jsx";
import ResumenReserva from "../components/cliente/ResumenReserva.jsx";

// Importamos nuestro nuevo service
import {
  obtenerServiciosPublicos,
  crearReservaPublica,
} from "../services/reservas.service.js";

// Mock de horarios fijos (Si después querés, conectamos esto también al back para ver disponibilidad real)
const HORARIOS_DISPONIBLES = [
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

  // Estados de Datos del Backend
  const [categoriasServicios, setCategoriasServicios] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [enviandoReserva, setEnviandoReserva] = useState(false);
  const [reservaExitosa, setReservaExitosa] = useState(false);

  // Estados del Formulario
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(hoy);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

  // 👉 AL CARGAR LA PÁGINA: Traemos los servicios del backend
  useEffect(() => {
    const cargarServicios = async () => {
      try {
        setCargandoDatos(true);
        const serviciosDb = await obtenerServiciosPublicos();

        if (serviciosDb) {
          // Lógica para agrupar el array plano en categorías: { "Peluquería": [...], "Uñas": [...] }
          const agrupados = serviciosDb.reduce((acc, servicio) => {
            const cat = servicio.categoria || "Otros Servicios";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(servicio);
            return acc;
          }, {});

          // Lo convertimos al formato que espera nuestro SelectorServicios
          const arrayCategorias = Object.keys(agrupados).map((cat) => ({
            categoria: cat,
            servicios: agrupados[cat],
          }));

          setCategoriasServicios(arrayCategorias);
        }
      } catch (error) {
        toast.error("Hubo un problema al cargar los servicios.");
      } finally {
        setCargandoDatos(false);
      }
    };

    cargarServicios();
  }, []);

  const resetearReserva = () => {
    setServicioSeleccionado(null);
    setHorarioSeleccionado(null);
    setFechaSeleccionada(hoy);
  };

  // 👉 EL POST AL BACKEND
  const confirmarReserva = async (datosCliente) => {
    setEnviandoReserva(true);
    const loadToast = toast.loading("Procesando tu reserva...");

    // Unimos la fecha seleccionada con la hora seleccionada
    const fechaHoraUnida = new Date(fechaSeleccionada);
    const [horas, minutos] = horarioSeleccionado.split(":");
    fechaHoraUnida.setHours(parseInt(horas), parseInt(minutos), 0);

    const payload = {
      servicioId: servicioSeleccionado.id,
      fechaHora: fechaHoraUnida.toISOString(),
      estado: "PENDIENTE", // Entra como pendiente hasta que Cynthia lo confirme
      clienteManual: `${datosCliente.nombre} - Tel: ${datosCliente.telefono}`,
    };

    try {
      await crearReservaPublica(payload);
      toast.success("¡Reserva confirmada con éxito!", { id: loadToast });
      setReservaExitosa(true);
    } catch (error) {
      toast.error("No se pudo completar la reserva. Intenta de nuevo.", {
        id: loadToast,
      });
      setEnviandoReserva(false);
    }
  };

  // PANTALLA DE ÉXITO
  if (reservaExitosa) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // 👉 AGREGAMOS overflow-x-hidden ACÁ:
          className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans pb-32 overflow-x-hidden"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            ¡Todo Listo!
          </h2>
          <p className="text-gray-500 mb-8">
            Tu turno fue agendado correctamente. Te esperamos en el salón.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-colors"
          >
            Volver al inicio
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans pb-32"
    >
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-pink-600 mb-2">
            Reserva tu Experiencia
          </h1>
          <p className="text-gray-500 text-lg">
            Personaliza tu cita premium de belleza y bienestar.
          </p>
        </div>

        {cargandoDatos ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            <p className="text-gray-500 mt-4 font-medium">
              Cargando catálogo de servicios...
            </p>
          </div>
        ) : (
          <>
            <SelectorServicios
              categorias={categoriasServicios}
              servicioSeleccionado={servicioSeleccionado}
              setServicioSeleccionado={setServicioSeleccionado}
            />

            <SelectorFechaHora
              fechaSeleccionada={fechaSeleccionada}
              setFechaSeleccionada={setFechaSeleccionada}
              horarioSeleccionado={horarioSeleccionado}
              setHorarioSeleccionado={setHorarioSeleccionado}
              horariosDisponibles={HORARIOS_DISPONIBLES}
              servicioSeleccionado={servicioSeleccionado}
              hoy={hoy}
            />

            <AnimatePresence>
              {servicioSeleccionado && horarioSeleccionado && (
                <ResumenReserva
                  servicio={servicioSeleccionado}
                  fecha={fechaSeleccionada}
                  hora={horarioSeleccionado}
                  onConfirmar={confirmarReserva}
                  onCancelar={resetearReserva}
                  cargando={enviandoReserva}
                />
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Reservar;
