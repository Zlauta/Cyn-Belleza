import React from "react";
import { Scissors, Sparkles, Eye } from "lucide-react";

const MetricasTarjetas = ({ turnos }) => {
  const hoyStr = new Date().toISOString().split("T")[0];

  const turnosDeHoy = turnos.filter((t) => {
    const fechaTurno = new Date(t.fechaHora).toISOString().split("T")[0];
    return fechaTurno === hoyStr && t.estado !== "CANCELADO";
  });

  const calcularMetrica = (palabrasClave) => {
    const filtrados = turnosDeHoy.filter((t) =>
      palabrasClave.some(
        (p) =>
          t.servicio?.nombre?.toLowerCase().includes(p) ||
          t.servicio?.categoria?.toLowerCase().includes(p),
      ),
    );
    return {
      turnos: filtrados.length,
      ingresos: filtrados.reduce(
        (acc, t) => acc + (t.servicio?.precio || 0),
        0,
      ),
    };
  };

  const METRICAS = [
    {
      id: 1,
      titulo: "Peluquería",
      ...calcularMetrica([
        "corte",
        "brushing",
        "color",
        "peinado",
        "peluquería",
        "alisado",
        "balayage",
        "botox",
      ]),
      icon: Scissors,
      color: "text-pink-600",
      bg: "bg-pink-100",
      trend: "Hoy",
    },
    {
      id: 2,
      titulo: "Manicura y Pedicura",
      ...calcularMetrica([
        "uña",
        "esculpidas",
        "manicura",
        "pedicura",
        "kapping",
        "semipermanente",
      ]),
      icon: Sparkles,
      color: "text-purple-600",
      bg: "bg-purple-100",
      trend: "Hoy",
    },
    {
      id: 3,
      titulo: "Estética Facial",
      ...calcularMetrica([
        "pestaña",
        "lifting",
        "ceja",
        "perfilado",
        "laminado",
        "maquillaje",
        "limpieza",
        "facial",
      ]),
      icon: Eye,
      color: "text-rose-600",
      bg: "bg-rose-100",
      trend: "Hoy",
    },
  ];

  return (
    // 👉 FIX: Cambiado a grid-cols-3 en desktop para que ocupe todo el ancho sin huecos
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {METRICAS.map((metrica) => {
        const Icono = metrica.icon;
        return (
          <div
            key={metrica.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${metrica.bg}`}
              >
                <Icono className={`w-6 h-6 ${metrica.color}`} />
              </div>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${metrica.ingresos === 0 ? "bg-gray-100 text-gray-500" : "bg-emerald-50 text-emerald-600"}`}
              >
                {metrica.trend}
              </span>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                {metrica.titulo}
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-2xl font-black text-gray-900">
                  {metrica.turnos}{" "}
                  <span className="text-lg font-bold text-gray-600">
                    Turnos
                  </span>
                </h3>
              </div>
              <p className="text-sm text-gray-500">
                Ingresos:{" "}
                <span
                  className={`font-bold ${metrica.ingresos > 0 ? "text-emerald-600" : "text-gray-900"}`}
                >
                  ${metrica.ingresos.toLocaleString("es-AR")}
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricasTarjetas;
