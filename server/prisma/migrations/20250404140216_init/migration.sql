/*
  Warnings:

  - You are about to drop the column `codigo` on the `Empleado` table. All the data in the column will be lost.
  - You are about to drop the `_ResumenEmpleados` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ResumenEmpleados" DROP CONSTRAINT "_ResumenEmpleados_A_fkey";

-- DropForeignKey
ALTER TABLE "_ResumenEmpleados" DROP CONSTRAINT "_ResumenEmpleados_B_fkey";

-- DropIndex
DROP INDEX "Empleado_codigo_key";

-- AlterTable
ALTER TABLE "Empleado" DROP COLUMN "codigo";

-- DropTable
DROP TABLE "_ResumenEmpleados";
