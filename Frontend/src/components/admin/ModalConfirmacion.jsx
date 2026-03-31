import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const ModalConfirmacion = ({ abierto, cerrar, confirmar, titulo, mensaje }) => {
  return (
    <AnimatePresence>
      {abierto && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Fondo oscuro con blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrar}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          />

          {/* Tarjeta del Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden text-center p-8"
          >
            {/* Ícono de Alerta */}
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 text-red-500">
              <AlertTriangle className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-black text-gray-900 mb-2">{titulo}</h2>
            <p className="text-gray-500 mb-8">{mensaje}</p>

            <div className="flex gap-3">
              <button
                onClick={cerrar}
                className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmar}
                className="flex-1 py-3.5 bg-red-500 text-white font-bold rounded-xl shadow-md shadow-red-500/20 hover:bg-red-600 transition-colors"
              >
                Sí, Desactivar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ModalConfirmacion;
