import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Star,
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  Clock,
  Award,
  Quote,
} from "lucide-react";

const categorias = [
  {
    id: 1,
    nombre: "Peluquería",
    imagen: "public/assets/Peluqueria.jpg",
  },
  {
    id: 2,
    nombre: "Manicura y Pedicura",
    imagen: "public/assets/Manicura.jpeg",
  },
  {
    id: 3,
    nombre: "Estética Facial",
    imagen: "public/assets/Maquillaje.jpg",
  },
];

const testimonios = [
  {
    id: 1,
    nombre: "Laura G.",
    texto:
      "Cynthia es una genia. Logró exactamente el color que quería sin dañar mi pelo. ¡El salón es hermoso!",
  },
  {
    id: 2,
    nombre: "Sofía M.",
    texto:
      "Las uñas me duran intactas casi un mes. La atención es de primera y los productos son excelentes.",
  },
  {
    id: 3,
    nombre: "Valentina R.",
    texto:
      "Me hice un lifting de pestañas y me cambió la mirada. El ambiente es súper relajante, te sentís una reina.",
  },
];

const Home = () => {
  const location = useLocation();

  // 👉 FIX: Mejoramos la lógica del scroll suave.
  useEffect(() => {
    if (location.hash === "#nosotros") {
      // Usamos requestAnimationFrame + setTimeout para asegurar que el DOM ya pintó todo
      requestAnimationFrame(() => {
        setTimeout(() => {
          const elemento = document.getElementById("nosotros");
          if (elemento) {
            // Hacemos el scroll manual
            window.scrollTo({
              top: elemento.offsetTop - 80, // -80 compensa el alto del navbar
              behavior: "smooth",
            });
          }
        }, 150); // Le damos un poquitito más de tiempo a React
      });
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      {/* 1. HERO SECTION (Tamaño Ajustado para Móvil) */}
      {/* 👉 FIX: Cambiamos padding top y bottom. De py-20 a py-12 en móviles, y agregamos min-h-[75vh] para que no ocupe toda la pantalla */}
      <header className="relative bg-gray-900 text-white border-b-[6px] border-pink-600 flex flex-col justify-center min-h-[75vh] lg:min-h-[85vh]">
        <div className="absolute inset-0 opacity-40">
          <img
            src="public/assets/Hero.png"
            alt="Salón de belleza"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Capa extra de gradiente para que el texto resalte mejor */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900/50"></div>

        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-32 flex flex-col items-center text-center mt-10 lg:mt-0">
          <span className="inline-flex items-center gap-1.5 bg-pink-500/20 text-pink-300 text-xs px-4 py-1.5 rounded-full font-bold tracking-widest border border-pink-500/30 mb-6 backdrop-blur-sm uppercase">
            <Sparkles className="w-4 h-4" /> Experiencia Premium
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight drop-shadow-lg">
            Realza tu <br className="md:hidden" />{" "}
            {/* Salto de línea solo en celus */}
            <span className="text-pink-500">belleza natural</span>
          </h1>
          <p className="mt-6 text-base md:text-lg lg:text-xl text-gray-200 max-w-2xl drop-shadow-md">
            Descubre un espacio de lujo y cuidado personal en manos de expertos.
            Transformamos tu imagen con las últimas tendencias.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              to="/reservar"
              className="bg-pink-600 text-white px-8 py-3.5 rounded-xl text-base lg:text-lg font-bold hover:bg-pink-700 transition shadow-lg shadow-pink-600/30 hover:-translate-y-1 text-center"
            >
              Reservar Turno
            </Link>
            <Link
              to="/servicios"
              className="bg-white/10 text-white px-8 py-3.5 rounded-xl text-base lg:text-lg font-bold hover:bg-white/20 transition backdrop-blur-md border border-white/20 hover:-translate-y-1 text-center"
            >
              Ver Servicios
            </Link>
          </div>
        </div>
      </header>

      {/* 2. SECCIÓN HIGHLIGHTS / BENEFICIOS */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="flex flex-col items-center text-center md:px-6 pt-4 md:pt-0">
              <ShieldCheck className="w-10 h-10 text-pink-500 mb-3" />
              <h3 className="font-bold text-gray-900">Productos Premium</h3>
              <p className="text-sm text-gray-500 mt-1">
                Solo usamos las mejores marcas para cuidar tu salud.
              </p>
            </div>
            <div className="flex flex-col items-center text-center md:px-6 pt-8 md:pt-0">
              <Clock className="w-10 h-10 text-pink-500 mb-3" />
              <h3 className="font-bold text-gray-900">Puntualidad</h3>
              <p className="text-sm text-gray-500 mt-1">
                Respetamos tu tiempo con nuestro sistema de reservas.
              </p>
            </div>
            <div className="flex flex-col items-center text-center md:px-6 pt-8 md:pt-0">
              <Award className="w-10 h-10 text-pink-500 mb-3" />
              <h3 className="font-bold text-gray-900">
                Atención Personalizada
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Asesoramiento exclusivo para encontrar tu estilo ideal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECCIÓN SERVICIOS */}
      <section className="bg-gray-50 max-w-7xl mx-auto px-4 py-20 sm:py-24 sm:px-6 lg:px-8 rounded-b-[3rem]">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
            Nuestros Servicios
          </h2>
          <div className="w-16 sm:w-20 h-1.5 bg-pink-600 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {categorias.map((cat) => (
            <Link
              key={cat.id}
              to="/servicios"
              state={{ categoriaPreseleccionada: cat.nombre }}
              className="relative group overflow-hidden rounded-3xl shadow-xl shadow-gray-200/50 aspect-[4/5] block cursor-pointer"
            >
              <img
                src={cat.imagen}
                alt={cat.nombre}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-8 transition-colors group-hover:from-black/95">
                <h3 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {cat.nombre}
                </h3>
                <span className="text-pink-400 text-sm font-bold mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1">
                  Explorar opciones →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. SECCIÓN NOSOTROS */}
      {/* 👉 FIX: id "nosotros" agregado explícitamente */}
      {/* 4. SECCIÓN NOSOTROS */}
      <section id="nosotros" className="bg-white py-20 sm:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
          <div className="relative aspect-square max-w-xs sm:max-w-md mx-auto lg:mx-0 w-full order-2 lg:order-1">
            <div className="absolute -inset-4 bg-pink-200 rounded-full opacity-50 blur-3xl animate-pulse"></div>
            <div className="relative w-full h-full bg-gray-100 rounded-full flex items-center justify-center shadow-2xl border-8 border-white overflow-hidden group">
              <img
                src="public/assets/Salon.jpeg"
                alt="El salón"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Star className="w-16 h-16 sm:w-20 sm:h-20 text-white/80" />
              </div>
            </div>
          </div>

          <div className="text-center lg:text-left order-1 lg:order-2">
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 text-pink-600 font-bold tracking-widest uppercase text-sm mb-3 w-full">
              <HeartHandshake className="w-5 h-5" /> Nuestra Esencia
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-gray-900">
              Pasión por tu <span className="text-pink-600">Mejor Versión</span>
            </h2>

            <div className="mt-6 space-y-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              <p>
                En <strong>CYN Belleza</strong>, creemos que el talento se nutre
                con dedicación. Desde que abrimos nuestras puertas en{" "}
                <strong>2022</strong>, el objetivo siempre fue uno: ofrecerte un
                servicio de excelencia que resalte tu estilo único.
              </p>
              <p>
                Soy una apasionada por el crecimiento profesional. Me he
                capacitado extensamente en peluquería, manicura y maquillaje,
                buscando siempre estar a la vanguardia de las últimas
                tendencias.
              </p>
              <p>
                Porque creo firmemente que nunca se deja de aprender,
                actualmente sigo expandiendo mis conocimientos estudiando
                barbería. Cada clienta que se sienta en mi sillón recibe el
                resultado de horas de estudio, esfuerzo y el compromiso de
                brindar siempre el mejor servicio.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-8 sm:gap-12">
              <div>
                <span className="text-4xl sm:text-5xl font-black text-pink-600 drop-shadow-sm">
                  2022
                </span>
                <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">
                  Año de Inicio
                </p>
              </div>
              <div>
                <span className="text-4xl sm:text-5xl font-black text-pink-600 drop-shadow-sm">
                  4+
                </span>
                <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">
                  Especialidades
                </p>
              </div>
              <div>
                <span className="text-4xl sm:text-5xl font-black text-pink-600 drop-shadow-sm">
                  100%
                </span>
                <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">
                  Dedicación
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN TESTIMONIOS */}
      <section className="bg-pink-50 py-20 sm:py-24 border-t border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl font-black text-gray-900">
              Lo que dicen nuestras clientas
            </h2>
            <div className="w-16 h-1.5 bg-pink-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonios.map((testimonio) => (
              <div
                key={testimonio.id}
                className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-pink-100/50 relative"
              >
                <Quote className="absolute top-6 right-6 w-6 h-6 sm:w-8 sm:h-8 text-pink-100" />
                <div className="flex gap-1 text-pink-500 mb-4">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                </div>
                <p className="text-sm sm:text-base text-gray-600 italic mb-6">
                  "{testimonio.texto}"
                </p>
                <div className="font-bold text-gray-900 text-sm sm:text-base">
                  - {testimonio.nombre}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
