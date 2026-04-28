import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom"; // 👉 Importamos useLocation
import { ArrowRight, Clock } from "lucide-react";
import { obtenerServiciosPublicos } from "../services/reservas.service.js";

const obtenerImagenPorCategoria = (categoria) => {
  const imagenes = {
    Peluquería:
      "/assets/Peluqueria.jpeg",
    "Manicura y Pedicura":
      "/assets/Unas.png",
    "Estética Facial":
      "/assets/Maquillaje2.png",
    default:
      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=400",
  };
  return imagenes[categoria] || imagenes["default"];
};

const Servicios = () => {
  const [serviciosDB, setServiciosDB] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("");
  const [cargando, setCargando] = useState(true);

  const location = useLocation(); // 👉 Leemos la ruta y su estado oculto

  useEffect(() => {
    const cargarServicios = async () => {
      try {
        setCargando(true);
        const data = await obtenerServiciosPublicos();
        const serviciosActivos = data.filter((s) => s.activo);
        setServiciosDB(serviciosActivos);

        const categoriasUnicas = [
          ...new Set(serviciosActivos.map((s) => s.categoria)),
        ];
        setCategorias(categoriasUnicas);

        // 👉 NUEVA LÓGICA: Atrapa la categoría que mandamos desde el Home
        const preseleccion = location.state?.categoriaPreseleccionada;

        if (preseleccion && categoriasUnicas.includes(preseleccion)) {
          setCategoriaActiva(preseleccion);
        } else if (categoriasUnicas.length > 0) {
          setCategoriaActiva(categoriasUnicas[0]);
        }
      } catch (error) {
        console.error("Error al cargar los servicios:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarServicios();
  }, [location.state]); // 👉 Se vuelve a ejecutar si el state de location cambia

  const serviciosFiltrados = serviciosDB.filter(
    (s) => s.categoria === categoriaActiva,
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 flex flex-col pt-12 pb-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center">
        {/* ENCABEZADO Y TÍTULOS */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight"
          >
            Nuestros <span className="text-pink-600">Servicios</span>
          </motion.h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Descubrí nuestro menú de tratamientos diseñados para resaltar tu
            belleza única.
          </p>
        </div>

        {/* TABS (BOTONERA DE CATEGORÍAS) */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`relative px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                categoriaActiva === cat
                  ? "text-white bg-pink-600 shadow-md shadow-pink-200 scale-105"
                  : "bg-white text-gray-600 hover:bg-pink-50 hover:text-pink-600 border border-gray-200 shadow-sm"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {cargando ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        ) : (
          /* CONTENEDOR TIPO WIDGET (Diseño Overlay) */
          <div className="relative w-full flex flex-col-reverse lg:flex-row items-center justify-center mt-4">
            {/* LADO IZQUIERDO (Lista de Servicios) */}
            <div className="w-full lg:w-[45%] bg-white/30 lg:bg-white/40 backdrop-blur-2xl rounded-[2rem] p-6 sm:p-8 md:p-10 z-20 shadow-2xl border border-white/60 -mt-12 lg:mb-20 lg:-mr-14 relative">
              <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
                {categoriaActiva}
              </h2>
              <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                Diseñamos tu look ideal. Especialistas en realizar tu belleza
                natural con técnicas de vanguardia que armonizan tus facciones.
              </p>

              {/* LISTA DE SERVICIOS (Acordeón) */}
              <div className="space-y-1">
                <AnimatePresence mode="popLayout">
                  {serviciosFiltrados.map((servicio) => (
                    <motion.div
                      key={servicio.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="group border-b border-gray-300/50 pb-4 pt-3 last:border-0 last:pb-0"
                    >
                      {/* Cabecera del servicio */}
                      <div className="flex justify-between items-center cursor-pointer">
                        <span className="font-bold text-gray-800 text-sm group-hover:text-pink-600 transition-colors">
                          {servicio.nombre}
                        </span>
                        <span className="font-bold text-pink-600 text-xs">
                          Desde ${servicio.precio.toLocaleString("es-AR")}
                        </span>
                      </div>

                      {/* Info desplegable (Descripción + Botón) */}
                      <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300 ease-out">
                        <div className="overflow-hidden">
                          <div className="pt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                            {/* Descripción */}
                            <p className="text-gray-500 text-xs mb-4 leading-relaxed pr-4">
                              {servicio.descripcion ||
                                "Tratamiento profesional realizado con los mejores productos del mercado para asegurar resultados de excelencia."}
                            </p>

                            {/* Fila final: Duración y Botón */}
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                                <Clock className="w-3 h-3" />{" "}
                                {servicio.duracion} min
                              </span>

                              <Link
                                to="/reservar"
                                state={{ preseleccionId: servicio.id }}
                                className="text-xs font-bold bg-pink-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-1 hover:bg-pink-700 transition-all shadow-md shadow-pink-200/50 active:scale-95"
                              >
                                Reservar Ahora{" "}
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* LADO DERECHO (Imagen) */}
            <div className="w-full lg:w-[60%] h-[300px] lg:h-[600px] rounded-[2rem] overflow-hidden z-10 shadow-xl mt-0 lg:mt-12 relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={categoriaActiva}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  src={obtenerImagenPorCategoria(categoriaActiva)}
                  alt={categoriaActiva}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Servicios;
