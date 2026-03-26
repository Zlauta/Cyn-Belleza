/*
  Warnings:

  - Added the required column `descripcion` to the `Servicios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Servicios" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "descripcion" TEXT NOT NULL;
