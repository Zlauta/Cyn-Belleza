import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { obtenerTurnos } from "../../services/turno.services.js";
import MetricasTarjetas from "../../components/admin/MetricasTarjetas.jsx";
import TablaTurnosRecientes from "../../components/admin/TablaTurnosRecientes.jsx";

const Dashboard = () => {
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      try {
        setUsuarioLogueado(JSON.parse(usuarioGuardado));
      } catch (e) {
        console.error("Error al leer el usuario");
      }
    }

    const cargarDatos = async () => {
      try {
        setCargando(true);
        const data = await obtenerTurnos();
        setTurnos(data || []);
      } catch (error) {
        toast.error("Error al cargar los datos del panel");
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  return (
    // 👉 CAMBIO 1: Ajustamos el padding en celus (p-4) y en pantallas grandes (sm:p-6) para ganar espacio
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 w-full">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Panel de Control
          </h1>
          <p className="text-gray-500 mt-1">
            Bienvenida{" "}
            {usuarioLogueado?.nombre
              ? usuarioLogueado.nombre.split(" ")[0]
              : ""}
            , esto es lo que está pasando hoy en el salón.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/usuarios")}
            className="px-4 py-2 bg-white border border-pink-200 text-pink-600 rounded-lg font-bold hover:bg-pink-50 transition-colors shadow-sm whitespace-nowrap"
          >
            + Agregar Usuario
          </button>
          <button
            onClick={() => navigate("/admin/turnos")}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 transition-colors shadow-md shadow-pink-200 whitespace-nowrap"
          >
            Ir a la Agenda
          </button>
        </div>
      </div>

      {cargando ? (
        <div className="text-center py-10 text-gray-500 font-bold animate-pulse">
          Calculando métricas del día...
        </div>
      ) : (
        <>
          <MetricasTarjetas turnos={turnos} />

          {/* 👉 CAMBIO 2: Envolvemos la tabla en un div con overflow-x-auto */}
          {/* Esto crea una barra de scroll horizontal invisible solo para la tabla en celulares */}
          <div className="w-full overflow-x-auto pb-4 -mx-0 px-0 sm:mx-0 sm:px-0">
            <TablaTurnosRecientes
              turnos={turnos}
              setTurnos={setTurnos}
              navigate={navigate}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
