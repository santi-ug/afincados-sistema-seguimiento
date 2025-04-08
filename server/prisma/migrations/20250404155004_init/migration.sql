/*
  Warnings:

  - You are about to drop the `ArchivoExcel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Empleado` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Producto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RegistroDetalle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResumenDiario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RegistroDetalle" DROP CONSTRAINT "RegistroDetalle_resumenDiarioId_fkey";

-- DropForeignKey
ALTER TABLE "ResumenDiario" DROP CONSTRAINT "ResumenDiario_archivoExcelId_fkey";

-- DropTable
DROP TABLE "ArchivoExcel";

-- DropTable
DROP TABLE "Empleado";

-- DropTable
DROP TABLE "Lote";

-- DropTable
DROP TABLE "Producto";

-- DropTable
DROP TABLE "RegistroDetalle";

-- DropTable
DROP TABLE "ResumenDiario";

-- CreateTable
CREATE TABLE "Empleados" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Empleados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Productos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "gramajes" INTEGER[],
    "categoria" "Categoria" NOT NULL,

    CONSTRAINT "Productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchivoExcels" (
    "id" SERIAL NOT NULL,
    "fechaCarga" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filePath" TEXT NOT NULL,

    CONSTRAINT "ArchivoExcels_pkey" PRIMARY KEY ("id")
);
