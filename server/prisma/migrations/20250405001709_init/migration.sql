-- CreateTable
CREATE TABLE "Registro" (
    "id" SERIAL NOT NULL,
    "productoId" INTEGER NOT NULL,
    "gramaje" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "empleadoId" INTEGER NOT NULL,
    "fechaProduccion" TIMESTAMP(3) NOT NULL,
    "lote" TEXT NOT NULL,
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "archivoExcelId" INTEGER NOT NULL,

    CONSTRAINT "Registro_pkey" PRIMARY KEY ("id")
);
