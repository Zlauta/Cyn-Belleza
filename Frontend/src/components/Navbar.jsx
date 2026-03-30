import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';

const LINKS = [
  { nombre: 'Inicio', ruta: '/' },
  { nombre: 'Servicios', ruta: '/servicios' },
  { nombre: 'Nosotros', ruta: '/nosotros' },
];

const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const location = useLocation(); // Nos dice en qué página estamos

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 🌺 LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl font-black tracking-tighter text-black transition-transform group-hover:scale-105">
              CYN <span className="text-pink-600">Belleza</span>
            </span>
          </Link>

          {/* 💻 LINKS DESKTOP (Animados) */}
          <div className="hidden md:flex items-center space-x-2">
            {LINKS.map((link) => {
              const estaActivo = location.pathname === link.ruta;
              
              return (
                <Link key={link.nombre} to={link.ruta} className="relative px-4 py-2">
                  {/* El indicador que se desliza suavemente (layoutId es la clave) */}
                  {estaActivo && (
                    <motion.div
                      layoutId="burbuja-navbar"
                      className="absolute inset-0 bg-pink-50 rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {/* El texto que se agranda y cambia de color */}
                  <motion.span
                    animate={{ 
                      color: estaActivo ? '#db2777' : '#4b5563', // pink-600 vs gray-600
                      scale: estaActivo ? 1.05 : 1,
                      fontWeight: estaActivo ? 700 : 500
                    }}
                    className="relative z-10 text-sm block transition-colors hover:text-pink-600"
                  >
                    {link.nombre}
                  </motion.span>
                </Link>
              );
            })}
          </div>

          {/* 🚀 BOTONES DERECHA (Reservar y Login) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-gray-500 hover:text-pink-600 transition-colors p-2 rounded-full hover:bg-pink-50">
              <User className="w-5 h-5" />
            </Link>
            <Link to="/reservar">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-black/20 hover:bg-gray-800 transition-colors"
              >
                Reservar Turno
              </motion.button>
            </Link>
          </div>

          {/* 🍔 BOTÓN MENÚ HAMBURGUESA (Móvil) */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="text-gray-600 hover:text-pink-600 focus:outline-none p-2"
            >
              {menuAbierto ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* 📱 MENÚ DESPLEGABLE MÓVIL (Animado) */}
      <AnimatePresence>
        {menuAbierto && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 shadow-xl">
              {LINKS.map((link) => {
                const estaActivo = location.pathname === link.ruta;
                return (
                  <Link 
                    key={link.nombre} 
                    to={link.ruta}
                    onClick={() => setMenuAbierto(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                      estaActivo ? 'bg-pink-50 text-pink-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {link.nombre}
                  </Link>
                );
              })}
              <div className="pt-4 flex flex-col gap-3">
                <Link 
                  to="/login"
                  onClick={() => setMenuAbierto(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50"
                >
                  <User className="w-5 h-5" /> Mi Cuenta
                </Link>
                <Link 
                  to="/reservar"
                  onClick={() => setMenuAbierto(false)}
                  className="w-full text-center bg-black text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-800"
                >
                  Reservar Turno
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;