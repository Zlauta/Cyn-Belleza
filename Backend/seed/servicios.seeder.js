import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const serviciosBase = [
  // --- PELUQUERÍA ---
  {
    nombre: "Corte Femenino",
    precio: 12000,
    duracion: 45,
    categoria: "Peluquería",
    activo: true,
    descripcion:
      "Corte a medida según tus facciones, incluye asesoramiento, lavado y secado final.",
  },
  {
    nombre: "Corte Masculino",
    precio: 8000,
    duracion: 30,
    categoria: "Peluquería",
    activo: true,
    descripcion:
      "Corte clásico o en tendencia con máquina y tijera. Incluye lavado.",
  },
  {
    nombre: "Corte, Color y Tratamiento",
    precio: 65000,
    duracion: 120,
    categoria: "Peluquería",
    activo: true,
    descripcion:
      "Renovación total: diseño de color personalizado, corte de puntas y nutrición profunda.",
  },
  {
    nombre: "Balayage / Desgaste de Puntas",
    precio: 85000,
    duracion: 240,
    categoria: "Peluquería",
    activo: true,
    descripcion:
      "Técnica de iluminación natural para un efecto degradado perfecto y sin marcas.",
  },
  {
    nombre: "Alisado Definitivo",
    precio: 45000,
    duracion: 180,
    categoria: "Peluquería",
    activo: true,
    descripcion:
      "Tratamiento termoactivo para un cabello lacio, sin frizz y brillante por meses.",
  },
  {
    nombre: "Shock Keratínico / Botox",
    precio: 30000,
    duracion: 90,
    categoria: "Peluquería",
    activo: true,
    descripcion:
      "Restauración intensiva que elimina el frizz, sella cutículas y devuelve el brillo natural.",
  },
  {
    nombre: "Lavado y Brushing",
    precio: 15000,
    duracion: 45,
    categoria: "Peluquería",
    activo: true,
    descripcion:
      "Lavado relajante y modelado con secador para un acabado impecable y con movimiento.",
  },
  {
    nombre: "Peinado Social / Recogido",
    precio: 25000,
    duracion: 60,
    categoria: "Peluquería",
    activo: true,
    descripcion:
      "Peinado de fiesta, semirecogidos o recogidos elegantes ideales para eventos.",
  },

  // --- MANICURA Y PEDICURA ---
  {
    nombre: "Esmaltado Semipermanente",
    precio: 12000,
    duracion: 45,
    categoria: "Manicura y Pedicura",
    activo: true,
    descripcion:
      "Manicura rusa combinada con esmalte curado en cabina. Brillo intacto por 15 a 20 días.",
  },
  {
    nombre: "Uñas Esculpidas / Acrílicas",
    precio: 22000,
    duracion: 90,
    categoria: "Manicura y Pedicura",
    activo: true,
    descripcion:
      "Extensión de uñas con moldes para lograr el largo y la forma deseada. Altamente resistentes.",
  },
  {
    nombre: "Kapping Gel / Acrílico",
    precio: 15000,
    duracion: 60,
    categoria: "Manicura y Pedicura",
    activo: true,
    descripcion:
      "Fina capa protectora sobre tu uña natural para darle grosor y evitar que se quiebre.",
  },
  {
    nombre: "Belleza de Pies Tradicional",
    precio: 10000,
    duracion: 45,
    categoria: "Manicura y Pedicura",
    activo: true,
    descripcion:
      "Corte, limado, repujado de cutículas y esmaltado tradicional.",
  },
  {
    nombre: "Pedicura Spa (Completa)",
    precio: 18000,
    duracion: 60,
    categoria: "Manicura y Pedicura",
    activo: true,
    descripcion:
      "Tratamiento profundo con exfoliación, remoción de durezas, mascarilla hidratante y esmaltado.",
  },
  {
    nombre: "Remoción de Semipermanente",
    precio: 4000,
    duracion: 20,
    categoria: "Manicura y Pedicura",
    activo: true,
    descripcion:
      "Retiro seguro del producto utilizando técnicas que cuidan la salud de tu uña natural.",
  },

  // --- ESTÉTICA FACIAL ---
  {
    nombre: "Lifting de Pestañas + Tinte",
    precio: 18000,
    duracion: 60,
    categoria: "Estética Facial",
    activo: true,
    descripcion:
      "Arqueado natural de tus pestañas desde la raíz con efecto rímel y nutrición.",
  },
  {
    nombre: "Perfilado de Cejas",
    precio: 7000,
    duracion: 30,
    categoria: "Estética Facial",
    activo: true,
    descripcion:
      "Diseño y depilación de cejas respetando la morfología de tu rostro.",
  },
  {
    nombre: "Laminado de Cejas",
    precio: 15000,
    duracion: 45,
    categoria: "Estética Facial",
    activo: true,
    descripcion:
      "Fijación y alisado del vello de las cejas para lograr un look orgánico, peinado y tupido.",
  },
  {
    nombre: "Limpieza Facial Profunda",
    precio: 25000,
    duracion: 60,
    categoria: "Estética Facial",
    activo: true,
    descripcion:
      "Higiene, exfoliación, extracción de comedones (puntos negros) e hidratación intensa.",
  },
  {
    nombre: "Maquillaje Social (Noche/Fiesta)",
    precio: 35000,
    duracion: 60,
    categoria: "Estética Facial",
    activo: true,
    descripcion:
      "Maquillaje profesional de larga duración para eventos, con preparación de piel incluida.",
  },
  {
    nombre: "Maquillaje para Novias/Quinceañeras",
    precio: 85000,
    duracion: 120,
    categoria: "Estética Facial",
    activo: true,
    descripcion:
      "Diseño exclusivo a prueba de emociones. Incluye sesión de prueba previa al evento.",
  },
];

async function main() {
  console.log("🌱 Iniciando el sembrado de servicios...");

  for (const servicio of serviciosBase) {
    await prisma.servicios.create({
      data: servicio,
    });
    console.log(`✅ Creado: ${servicio.nombre}`);
  }

  console.log("🎉 ¡Todos los servicios fueron sembrados con éxito!");
}

main()
  .catch((e) => {
    console.error("❌ Error al sembrar la base de datos:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
