import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

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
              Tu santuario de belleza y bienestar. Dedicados a resaltar tu mejor
              versión con profesionalismo, elegancia y productos de primera
              línea.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/lj123789?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors duration-300"
              >
                <img
                  width="96"
                  height="96"
                  src="https://img.icons8.com/color/96/facebook.png"
                  alt="facebook"
                />
              </a>
              <a
                href="https://www.instagram.com/cyn.belleza?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors duration-300"
              >
                <img
                  width="96"
                  height="96"
                  src="https://img.icons8.com/color/96/instagram-new--v1.png"
                  alt="instagram-new--v1"
                />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="hover:text-pink-500 transition-colors flex items-center gap-2"
                >
                  <span className="text-pink-600 text-xs">▸</span> Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/servicios"
                  className="hover:text-pink-500 transition-colors flex items-center gap-2"
                >
                  <span className="text-pink-600 text-xs">▸</span> Servicios
                </Link>
              </li>
              <li>
                <Link
                  to="/nosotros"
                  className="hover:text-pink-500 transition-colors flex items-center gap-2"
                >
                  <span className="text-pink-600 text-xs">▸</span> Nosotros
                </Link>
              </li>
              <li>
                <Link
                  to="/reservar"
                  className="hover:text-pink-500 transition-colors flex items-center gap-2"
                >
                  <span className="text-pink-600 text-xs">▸</span> Reservar
                  Turno
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto y Horarios */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contacto</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                <span>
                  Martin Fierro 1300 <br />
                  Yerba Buena, Tucumán
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-pink-600 flex-shrink-0" />
                <span>+54 381 528-4954</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-pink-600 flex-shrink-0" />
                <span>brandancinthia65@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 pt-2 border-t border-gray-800">
                <Clock className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p>
                    <span className="text-white font-medium">Lun - Vie:</span>{" "}
                    16:00 - 21:00
                  </p>
                  <p>
                    <span className="text-white font-medium">Sábados:</span>{" "}
                    08:30 - 21:00
                  </p>
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.358627177462!2d-65.29150882534455!3d-26.828543489690805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x942243325a5a7a57%3A0x2e0363614a0ccdaf!2sMart%C3%ADn%20Fierro%201298-1200%2C%20Yerba%20Buena%2C%20Tucum%C3%A1n!5e0!3m2!1ses-419!2sar!4v1775667654806!5m2!1ses-419!2sar"
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
          <p>
            © {new Date().getFullYear()} CYN Belleza. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
