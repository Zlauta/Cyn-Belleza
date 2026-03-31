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
import { VistaTabla, VistaTarjetas } from "../../components/admin/VistasServicios.jsx";
import ModalServicio from "../../components/admin/ModalServicio.jsx";

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

  const [vista, setVista] = useState("tabla");
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [servicioAEditar, setServicioAEditar] = useState(null);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const data = await obtenerServicios();
      setServicios(data || []);
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
    const datosProcesados = { ...data, precio: Number(data.precio) };
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

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Seguro que deseas eliminar "${nombre}"?`)) return;
    const loadToast = toast.loading("Eliminando...");
    try {
      await eliminarServicio(id);
      toast.success("Servicio eliminado", { id: loadToast });
      setServicios(servicios.filter((s) => s.id !== id));
    } catch (error) {
      toast.error(error.message, { id: loadToast });
    }
  };

  const serviciosFiltrados = servicios.filter((servicio) => {
    const coincideCategoria =
      categoriaActiva === "Todas" || servicio.categoria === categoriaActiva;
    const coincideBusqueda = servicio.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
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
              handleDelete={handleDelete}
            />
          ) : (
            <VistaTarjetas
              servicios={serviciosFiltrados}
              abrirModal={abrirModal}
              handleDelete={handleDelete}
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
    </div>
  );
};

export default AdminServicios;
