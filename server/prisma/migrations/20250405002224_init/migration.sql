-- AlterTable
ALTER TABLE "Registros" ALTER COLUMN "empleadoId" DROP NOT NULL,
ALTER COLUMN "fechaProduccion" DROP NOT NULL,
ALTER COLUMN "lote" DROP NOT NULL,
ALTER COLUMN "fechaVencimiento" DROP NOT NULL,
ALTER COLUMN "archivoExcelId" DROP NOT NULL;
