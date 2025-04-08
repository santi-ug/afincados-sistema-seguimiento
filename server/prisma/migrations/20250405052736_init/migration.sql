/*
  Warnings:

  - The values [nmmmmmm] on the enum `Categoria` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `name` on the `Empleados` table. All the data in the column will be lost.
  - Added the required column `nombre` to the `Empleados` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Categoria_new" AS ENUM ('Condimentos', 'Hierbas', 'Reposteria');
ALTER TABLE "Productos" ALTER COLUMN "categoria" TYPE "Categoria_new" USING ("categoria"::text::"Categoria_new");
ALTER TYPE "Categoria" RENAME TO "Categoria_old";
ALTER TYPE "Categoria_new" RENAME TO "Categoria";
DROP TYPE "Categoria_old";
COMMIT;

-- AlterTable
ALTER TABLE "Empleados" DROP COLUMN "name",
ADD COLUMN     "nombre" TEXT NOT NULL;
