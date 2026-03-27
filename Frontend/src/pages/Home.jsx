import React from 'react';

// Componentes temporales (luego los moveremos a src/components)
const Navbar = () => (
  <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center">
          {/* Logo simulado de image_0.png */}
          <span className="text-2xl font-bold text-black">CYN <span className="text-pink-600">Belleza</span></span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm text-gray-700">
          <a href="/servicios" className="hover:text-pink-600">Servicios</a>
          <a href="#" className="hover:text-pink-600">Promociones</a>
          <a href="/nosotros" className="hover:text-pink-600">Nosotros</a>
          <a href="#" className="hover:text-pink-600">Contacto</a>
        </div>
        <div>
          <a href="/reservar" className="bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-pink-700 transition duration-150">
            Reservar Turno
          </a>
        </div>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="bg-black text-gray-300 mt-16 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
      <div>
        <span className="text-xl font-bold text-white">CYN <span className="text-pink-600">Belleza</span></span>
        <p className="text-sm mt-2">Tu centro de estética de confianza.</p>
      </div>
      {/* ... más columnas de footer simulando image_0.png ... */}
    </div>
    <div className="text-center text-xs mt-8 border-t border-gray-800 pt-4">
      © 2024 CYN Belleza. Todos los derechos reservados.
    </div>
  </footer>
);

// Datos simulados para las categorías de image_0.png
const categorias = [
  { id: 1, nombre: 'Peluquería', imagen: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=400' },
  { id: 2, nombre: 'Uñas', imagen: 'https://images.unsplash.com/photo-1604654894610-df490668710d?q=80&w=400' },
  { id: 3, nombre: 'Pestañas', imagen: 'https://images.unsplash.com/photo-1583011319767-464a4c16c805?q=80&w=400' },
  { id: 4, nombre: 'Barbería', imagen: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=400' },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      {/* Hero Section (Sección principal con imagen de fondo de image_0.png) */}
      <header className="relative bg-gray-900 text-white">
        {/* Imagen de fondo simulada */}
        <div className="absolute inset-0 opacity-40">
          <img src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=1600" alt="Salón de belleza" className="w-full h-full object-cover" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32 flex flex-col items-center text-center">
          <span className="inline-block bg-pink-100 text-pink-700 text-xs px-3 py-1 rounded-full font-semibold mb-4">
            EXPERIENCIA PREMIUM
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Realza tu<br />
            <span className="text-pink-500">belleza natural</span>
          </h1>
          <p className="mt-6 text-xl text-gray-200 max-w-2xl">
            Descubre una experiencia de lujo y cuidado personal en manos de expertos. Transformamos tu imagen con las últimas tendencias.
          </p>
          <div className="mt-10 flex gap-4">
            <a href="/reservar" className="bg-pink-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-pink-700 transition">
              Reservar Turno
            </a>
            <a href="/servicios" className="bg-white/10 text-white px-8 py-3 rounded-md font-semibold hover:bg-white/20 transition backdrop-blur-sm">
              Ver Servicios
            </a>
          </div>
        </div>
      </header>

      {/* Sección "Nuestros Servicios" (Tarjetas de image_0.png) */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Nuestros Servicios</h2>
          <div className="w-16 h-1 bg-pink-600 mx-auto mt-2 rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categorias.map((cat) => (
            <div key={cat.id} className="relative group overflow-hidden rounded-xl shadow-lg aspect-[3/4]">
              <img src={cat.imagen} alt={cat.nombre} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white">{cat.nombre}</h3>
                <a href="#" className="text-pink-400 text-sm font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver más →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección "Pasión por la Belleza" (Avatar de image_0.png) */}
      <section className="bg-gray-50 py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square max-w-sm mx-auto md:max-w-none">
            {/* Círculo rosa decorativo de fondo */}
            <div className="absolute -inset-4 bg-pink-100 rounded-full opacity-70 blur-2xl"></div>
            {/* Avatar simulado (luego pondremos la imagen real) */}
            <div className="relative w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-8xl shadow-inner border-4 border-white">
              👩🏻
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-extrabold leading-tight">
              Pasión por la <span className="text-pink-600">Belleza</span>
            </h2>
            <p className="mt-6 text-gray-700 leading-relaxed">
              En CYN Belleza, entendemos que tu imagen es el reflejo de tu bienestar interior. Con más de 10 años de trayectoria, nos hemos consolidado como un referente de estilo y vanguardia.
            </p>
            <div className="mt-8 flex gap-8">
                <div><span className="text-4xl font-bold text-pink-600">10+</span><p className="text-sm text-gray-600">Años de Experiencia</p></div>
                <div><span className="text-4xl font-bold text-pink-600">5k+</span><p className="text-sm text-gray-600">Clientes Felices</p></div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;