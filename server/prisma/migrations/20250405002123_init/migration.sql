/*
  Warnings:

  - You are about to drop the `Registro` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Registro";

-- CreateTable
CREATE TABLE "Registros" (
    "id" SERIAL NOT NULL,
    "productoId" INTEGER NOT NULL,
    "gramaje" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "empleadoId" INTEGER NOT NULL,
    "fechaProduccion" TIMESTAMP(3) NOT NULL,
    "lote" TEXT NOT NULL,
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "archivoExcelId" INTEGER NOT NULL,

    CONSTRAINT "Registros_pkey" PRIMARY KEY ("id")
);
