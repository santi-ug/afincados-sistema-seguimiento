/*
  Warnings:

  - You are about to drop the column `categoriaId` on the `Producto` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lote" DROP CONSTRAINT "Lote_productoId_fkey";

-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "RegistroDetalle" DROP CONSTRAINT "RegistroDetalle_productoId_fkey";

-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "categoriaId",
ADD COLUMN     "gramajes" INTEGER[];
