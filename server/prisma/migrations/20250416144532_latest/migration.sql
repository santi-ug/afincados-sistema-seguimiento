/*
  Warnings:

  - Added the required column `rowNumber` to the `Registros` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Registros" ADD COLUMN     "rowNumber" INTEGER NOT NULL;
