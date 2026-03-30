import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';

// 🗂️ Tus 4 Categorías
const CATEGORIAS = ['Peluquería', 'Uñas', 'Pestañas y Cejas', 'Maquillaje'];

// 📦 Base de datos simulada de servicios
const SERVICIOS_MOCK = [
  // Peluquería
  { id: 1, categoria: 'Peluquería', nombre: 'Corte y Brushing', precio: 15000, duracion: '60 min', descripcion: 'Asesoramiento de imagen, lavado con masajes capilares, corte de tendencia y secado profesional.', imagen: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=400' },
  { id: 2, categoria: 'Peluquería', nombre: 'Coloración Global', precio: 45000, duracion: '120 min', descripcion: 'Color uniforme desde la raíz a las puntas utilizando productos premium con protección.', imagen: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=400' },
  { id: 3, categoria: 'Peluquería', nombre: 'Balayage / Babylights', precio: 75000, duracion: '180 min', descripcion: 'Técnica de iluminación degradada para un efecto natural y de bajo mantenimiento.', imagen: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=400' },
  
  // Uñas
  { id: 4, categoria: 'Uñas', nombre: 'Manicura Semi-permanente', precio: 12000, duracion: '60 min', descripcion: 'Limpieza profunda de cutículas y esmaltado de larga duración (hasta 21 días).', imagen: 'https://images.unsplash.com/photo-1604654894610-df490668710d?q=80&w=400' },
  { id: 5, categoria: 'Uñas', nombre: 'Uñas Esculpidas', precio: 22000, duracion: '120 min', descripcion: 'Construcción de uñas en acrílico o gel para lograr el largo y la forma perfecta.', imagen: 'https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?q=80&w=400' },
  
  // Pestañas y Cejas
  { id: 6, categoria: 'Pestañas y Cejas', nombre: 'Lifting de Pestañas', precio: 18000, duracion: '60 min', descripcion: 'Arqueado natural de tus pestañas con tinte incluido para una mirada profunda.', imagen: 'https://images.unsplash.com/photo-1583011319767-464a4c16c805?q=80&w=400' },
  { id: 7, categoria: 'Pestañas y Cejas', nombre: 'Perfilado y Laminado', precio: 15000, duracion: '45 min', descripcion: 'Diseño de cejas según tu rostro, depilación con hilo y fijación para un look orgánico.', imagen: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=400' },
  
  // Maquillaje
  { id: 8, categoria: 'Maquillaje', nombre: 'Maquillaje Social', precio: 25000, duracion: '60 min', descripcion: 'Ideal para eventos. Piel perfecta, contornos y ojos destacados según tu estilo.', imagen: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=400' },
  { id: 9, categoria: 'Maquillaje', nombre: 'Maquillaje para Novias', precio: 60000, duracion: '120 min', descripcion: 'Servicio premium de larga duración a prueba de lágrimas. Incluye prueba previa.', imagen: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=400' },
];

const Servicios = () => {
  const [categoriaActiva, setCategoriaActiva] = useState(CATEGORIAS[0]);

  // Filtramos los servicios según la pestaña seleccionada
  const serviciosFiltrados = SERVICIOS_MOCK.filter(s => s.categoria === categoriaActiva);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
          >
            Nuestros <span className="text-pink-600">Servicios</span>
          </motion.h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Descubrí nuestro menú de tratamientos diseñados para resaltar tu belleza única. Calidad, precisión y los mejores productos del mercado.
          </p>
        </div>

        {/* 📑 Sistema de Pestañas (Tabs) */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`relative px-6 py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ${
                categoriaActiva === cat
                  ? 'text-pink-600 shadow-md'
                  : 'bg-white text-gray-600 hover:bg-pink-50 hover:text-pink-600 shadow-sm'
              }`}
            >
              {categoriaActiva === cat && (
                <motion.div
                  layoutId="burbuja-categoria"
                  className="absolute inset-0 bg-pink-600 rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {cat}
            </button>
          ))}
        </div>

        {/* 🃏 Grilla de Tarjetas FLIP */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {serviciosFiltrados.map((servicio) => (
              <motion.div
                key={servicio.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                // 👇 ACÁ EMPIEZA LA MAGIA CSS 3D
                className="group h-[400px] [perspective:1000px] cursor-pointer"
              >
                <div className="relative w-full h-full rounded-2xl shadow-lg transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  
                  {/* 🖼️ CARA FRONTAL (FOTO) */}
                  <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden [backface-visibility:hidden]">
                    <img src={servicio.imagen} alt={servicio.nombre} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6">
                      <span className="text-pink-400 font-bold text-sm tracking-wider uppercase mb-1">{servicio.categoria}</span>
                      <h3 className="text-2xl font-bold text-white leading-tight">{servicio.nombre}</h3>
                    </div>
                  </div>

                  {/* 📝 CARA TRASERA (INFO Y BOTÓN) */}
                  <div className="absolute inset-0 w-full h-full bg-gray-900 rounded-2xl p-8 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] border-2 border-pink-600 shadow-xl shadow-pink-900/20">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{servicio.nombre}</h3>
                      <div className="w-12 h-1 bg-pink-500 rounded mb-4"></div>
                      <p className="text-gray-300 text-sm leading-relaxed mb-6">
                        {servicio.descripcion}
                      </p>
                      <div className="flex items-center gap-2 text-pink-400 text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        <span>Duración: {servicio.duracion}</span>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <div className="text-3xl font-black text-white mb-4">
                        ${servicio.precio.toLocaleString('es-AR')}
                      </div>
                      <Link 
                        // Idealmente en el futuro le pasamos el ID por URL: to={`/reservar?servicio=${servicio.id}`}
                        to="/reservar" 
                        className="w-full bg-pink-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-pink-500 transition-colors"
                      >
                        Reservar Ahora <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Servicios;