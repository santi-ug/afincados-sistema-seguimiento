/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Empleado` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Empleado` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Empleado` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Empleado` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[codigo]` on the table `Empleado` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codigo` to the `Empleado` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Empleado_email_key";

-- AlterTable
ALTER TABLE "Empleado" DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "password",
DROP COLUMN "updatedAt",
ADD COLUMN     "codigo" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "codigoProducto" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchivoExcel" (
    "id" SERIAL NOT NULL,
    "fechaCarga" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filePath" TEXT NOT NULL,

    CONSTRAINT "ArchivoExcel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumenDiario" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "cantidadTotal" INTEGER NOT NULL,
    "loteConsolidado" TEXT NOT NULL,
    "archivoExcelId" INTEGER NOT NULL,

    CONSTRAINT "ResumenDiario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistroDetalle" (
    "id" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "resumenDiarioId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,

    CONSTRAINT "RegistroDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ResumenEmpleados" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ResumenEmpleados_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Producto_codigoProducto_key" ON "Producto"("codigoProducto");

-- CreateIndex
CREATE UNIQUE INDEX "ResumenDiario_archivoExcelId_key" ON "ResumenDiario"("archivoExcelId");

-- CreateIndex
CREATE INDEX "_ResumenEmpleados_B_index" ON "_ResumenEmpleados"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_codigo_key" ON "Empleado"("codigo");

-- AddForeignKey
ALTER TABLE "ResumenDiario" ADD CONSTRAINT "ResumenDiario_archivoExcelId_fkey" FOREIGN KEY ("archivoExcelId") REFERENCES "ArchivoExcel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroDetalle" ADD CONSTRAINT "RegistroDetalle_resumenDiarioId_fkey" FOREIGN KEY ("resumenDiarioId") REFERENCES "ResumenDiario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroDetalle" ADD CONSTRAINT "RegistroDetalle_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResumenEmpleados" ADD CONSTRAINT "_ResumenEmpleados_A_fkey" FOREIGN KEY ("A") REFERENCES "Empleado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResumenEmpleados" ADD CONSTRAINT "_ResumenEmpleados_B_fkey" FOREIGN KEY ("B") REFERENCES "ResumenDiario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
