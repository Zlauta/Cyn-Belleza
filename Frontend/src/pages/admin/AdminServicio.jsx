import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { Plus, Tag } from "lucide-react";

// 👉 Servicios Axios
import {
  obtenerServicios,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
} from "../../services/servicio.services.js";

// 👉 Componentes Hijos
import ToolbarServicios from "../../components/admin/ToolbarServicios.jsx";
import {
  VistaTabla,
  VistaTarjetas,
} from "../../components/admin/VistasServicios.jsx";
import ModalServicio from "../../components/admin/ModalServicio.jsx";
import ModalConfirmacion from "../../components/admin/ModalConfirmacion.jsx";

const CATEGORIAS = [
  "Todas",
  "Peluquería",
  "Uñas",
  "Pestañas y Cejas",
  "Maquillaje",
];

const AdminServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [vista, setVista] = useState("tabla");
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");

  const [servicioAEliminar, setServicioAEliminar] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [servicioAEditar, setServicioAEditar] = useState(null);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const data = await obtenerServicios();
      const serviciosMapeados = (data || []).map((servicio) => ({
        ...servicio,
        estado: servicio.activo ? "Activo" : "Inactivo",
      }));
      setServicios(serviciosMapeados);
    } catch (error) {
      toast.error("Error al cargar servicios: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const abrirModal = (servicio = null) => {
    setServicioAEditar(servicio);
    setModalAbierto(true);
  };

  const onSubmitForm = async (data) => {
    const datosProcesados = {
      ...data,
      precio: Number(data.precio),
      duracion: Number(data.duracion),
      activo: data.estado === "Activo",
    };
    delete datosProcesados.estado;
    const loadToast = toast.loading(
      servicioAEditar ? "Actualizando..." : "Creando...",
    );

    try {
      if (servicioAEditar)
        await actualizarServicio(servicioAEditar.id, datosProcesados);
      else await crearServicio(datosProcesados);

      toast.success(
        servicioAEditar ? "Servicio actualizado" : "Servicio creado",
        { id: loadToast },
      );
      setModalAbierto(false);
      cargarDatos();
    } catch (error) {
      toast.error(error.message, { id: loadToast });
    }
  };

  // 1. Esta función solo abre el modal y guarda qué servicio queremos borrar
  const solicitarEliminacion = (id, nombre) => {
    setServicioAEliminar({ id, nombre });
  };

  // 2. Esta función se ejecuta solo si el usuario hace clic en "Sí, eliminar"
  const confirmarEliminacion = async () => {
    if (!servicioAEliminar) return;

    const { id, nombre } = servicioAEliminar;
    const loadToast = toast.loading("Procesando...");

    try {
      // Le pegamos a la ruta de eliminar (que en tu back hace el update a false)
      await eliminarServicio(id);

      toast.success(`"${nombre}" fue desactivado.`, { id: loadToast });

      // 👉 EL CAMBIO CLAVE: En vez de borrarlo de React, lo pasamos a Inactivo
      setServicios(
        servicios.map((s) => (s.id === id ? { ...s, estado: "Inactivo" } : s)),
      );

      setServicioAEliminar(null); // Cerramos el modal
    } catch (error) {
      toast.error(error.message, { id: loadToast });
      setServicioAEliminar(null);
    }
  };

  const serviciosFiltrados = servicios.filter((servicio) => {
    const coincideCategoria =
      categoriaActiva === "Todas" || servicio.categoria === categoriaActiva;
    const coincideBusqueda = servicio.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideEstado =
      estadoFiltro === "Todos" || servicio.estado === estadoFiltro;
    return coincideCategoria && coincideBusqueda && coincideEstado;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Catálogo de Servicios
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestiona los tratamientos, precios y duraciones.
          </p>
        </div>
        <button
          onClick={() => abrirModal()}
          className="flex items-center gap-2 bg-pink-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-pink-700 transition-colors shrink-0"
        >
          <Plus className="w-5 h-5" /> Nuevo Servicio
        </button>
      </div>

      <ToolbarServicios
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        categoriaActiva={categoriaActiva}
        setCategoriaActiva={setCategoriaActiva}
        categorias={CATEGORIAS}
        vista={vista}
        setVista={setVista}
        estadoFiltro={estadoFiltro}
        setEstadoFiltro={setEstadoFiltro}
      />

      {cargando ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {serviciosFiltrados.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm"
            >
              <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900">
                No hay servicios
              </h3>
            </motion.div>
          ) : vista === "tabla" ? (
            <VistaTabla
              servicios={serviciosFiltrados}
              abrirModal={abrirModal}
              handleDelete={solicitarEliminacion}
            />
          ) : (
            <VistaTarjetas
              servicios={serviciosFiltrados}
              abrirModal={abrirModal}
              handleDelete={solicitarEliminacion}
            />
          )}
        </AnimatePresence>
      )}

      <ModalServicio
        abierto={modalAbierto}
        cerrar={() => setModalAbierto(false)}
        servicioAEditar={servicioAEditar}
        onSubmitForm={onSubmitForm}
        categorias={CATEGORIAS}
      />

      <ModalConfirmacion
        abierto={!!servicioAEliminar}
        cerrar={() => setServicioAEliminar(null)}
        confirmar={confirmarEliminacion}
        titulo="¿Desactivar Servicio?"
        mensaje={`Estás a punto de desactivar "${servicioAEliminar?.nombre}". Estas seguro?`}
      />
    </div>
  );
};

export default AdminServicios;
