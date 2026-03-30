import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-8 border-t-4 border-pink-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grilla Principal del Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Columna 1: Marca y Redes */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-black tracking-tighter text-white">
                CYN <span className="text-pink-600">Belleza</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Tu santuario de belleza y bienestar. Dedicados a resaltar tu mejor versión con profesionalismo, elegancia y productos de primera línea.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors duration-300">
                <p>facebook</p>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors duration-300">
                <p>instagram</p>
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="hover:text-pink-500 transition-colors flex items-center gap-2"><span className="text-pink-600 text-xs">▸</span> Inicio</Link></li>
              <li><Link to="/servicios" className="hover:text-pink-500 transition-colors flex items-center gap-2"><span className="text-pink-600 text-xs">▸</span> Servicios</Link></li>
              <li><Link to="/nosotros" className="hover:text-pink-500 transition-colors flex items-center gap-2"><span className="text-pink-600 text-xs">▸</span> Nosotros</Link></li>
              <li><Link to="/reservar" className="hover:text-pink-500 transition-colors flex items-center gap-2"><span className="text-pink-600 text-xs">▸</span> Reservar Turno</Link></li>
            </ul>
          </div>

          {/* Columna 3: Contacto y Horarios */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contacto</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                <span>Av. Santa Fe 1234, Piso 2<br/>CABA, Argentina</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-pink-600 flex-shrink-0" />
                <span>+54 11 4567-8900</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-pink-600 flex-shrink-0" />
                <span>hola@cynbelleza.com</span>
              </li>
              <li className="flex items-start gap-3 pt-2 border-t border-gray-800">
                <Clock className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p><span className="text-white font-medium">Lun - Vie:</span> 09:00 - 20:00</p>
                  <p><span className="text-white font-medium">Sábados:</span> 10:00 - 18:00</p>
                  <p className="text-pink-500 font-medium">Domingos Cerrado</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Columna 4: El Mapita Mágico */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Encuéntranos</h3>
            <div className="w-full h-48 rounded-xl overflow-hidden shadow-lg border-2 border-gray-800 group relative">
              {/* Capa para que no haga scroll sin querer en móviles, desaparece al pasar el mouse */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent pointer-events-none transition-colors duration-300 z-10"></div>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.016713276848!2d-58.39958018477038!3d-34.59419148046182!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca975176b6b7%3A0xc0fb19ce6a21e4ea!2sAv.%20Sta.%20Fe%201234%2C%20C1059ABO%20CABA!5e0!3m2!1ses-419!2sar!4v1680000000000!5m2!1ses-419!2sar" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de ubicación del salón"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} CYN Belleza. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;