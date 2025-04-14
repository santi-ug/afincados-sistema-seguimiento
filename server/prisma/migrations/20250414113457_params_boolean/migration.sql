/*
  Warnings:

  - The `paramCalidadEmpaque` column on the `Registros` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paramCalidadPeso` column on the `Registros` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paramCalidadSinPresenciaDeSustanciasExtranas` column on the `Registros` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Registros" DROP COLUMN "paramCalidadEmpaque",
ADD COLUMN     "paramCalidadEmpaque" BOOLEAN,
DROP COLUMN "paramCalidadPeso",
ADD COLUMN     "paramCalidadPeso" BOOLEAN,
DROP COLUMN "paramCalidadSinPresenciaDeSustanciasExtranas",
ADD COLUMN     "paramCalidadSinPresenciaDeSustanciasExtranas" BOOLEAN;
