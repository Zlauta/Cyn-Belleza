/*
  Warnings:

  - The values [PROFESIONAL] on the enum `Rol` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `profesionalId` on the `Turno` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Usuarios` table. All the data in the column will be lost.
  - Added the required column `contrasenia` to the `Usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Rol_new" AS ENUM ('ADMIN', 'CLIENTE');
ALTER TABLE "public"."Usuarios" ALTER COLUMN "rol" DROP DEFAULT;
ALTER TABLE "Usuarios" ALTER COLUMN "rol" TYPE "Rol_new" USING ("rol"::text::"Rol_new");
ALTER TYPE "Rol" RENAME TO "Rol_old";
ALTER TYPE "Rol_new" RENAME TO "Rol";
DROP TYPE "public"."Rol_old";
ALTER TABLE "Usuarios" ALTER COLUMN "rol" SET DEFAULT 'CLIENTE';
COMMIT;

-- DropForeignKey
ALTER TABLE "Turno" DROP CONSTRAINT "Turno_profesionalId_fkey";

-- AlterTable
ALTER TABLE "Turno" DROP COLUMN "profesionalId";

-- AlterTable
ALTER TABLE "Usuarios" DROP COLUMN "password",
ADD COLUMN     "contrasenia" TEXT NOT NULL;
