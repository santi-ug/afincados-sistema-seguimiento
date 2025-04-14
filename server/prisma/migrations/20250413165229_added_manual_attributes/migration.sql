-- CreateEnum
CREATE TYPE "MaterialType" AS ENUM ('CONDIMENTO', 'HIERBAS', 'REPOSTERIA');

-- CreateEnum
CREATE TYPE "AccionResultado" AS ENUM ('AC', 'RE');

-- AlterTable
ALTER TABLE "Registros" ADD COLUMN     "accionResultado" "AccionResultado",
ADD COLUMN     "accionesCorrectivas" TEXT,
ADD COLUMN     "cliente" TEXT,
ADD COLUMN     "color" BOOLEAN,
ADD COLUMN     "condVerificado" BOOLEAN,
ADD COLUMN     "empaqueConforme" BOOLEAN,
ADD COLUMN     "empaqueVerificado" BOOLEAN,
ADD COLUMN     "hierbasVerificado" BOOLEAN,
ADD COLUMN     "hora" TIMESTAMP(3),
ADD COLUMN     "libera" BOOLEAN,
ADD COLUMN     "materialType" "MaterialType",
ADD COLUMN     "nombreProducto" TEXT,
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "olor" BOOLEAN,
ADD COLUMN     "paquetesCantidad" INTEGER,
ADD COLUMN     "paramCalidadEmpaque" TEXT,
ADD COLUMN     "paramCalidadPeso" TEXT,
ADD COLUMN     "paramCalidadSinPresenciaDeSustanciasExtranas" TEXT,
ADD COLUMN     "reposteriaVerificado" BOOLEAN,
ADD COLUMN     "sabor" BOOLEAN,
ADD COLUMN     "varProcesoConforme" BOOLEAN;
