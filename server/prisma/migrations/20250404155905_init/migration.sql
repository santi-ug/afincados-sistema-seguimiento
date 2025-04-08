/*
  Warnings:

  - You are about to drop the column `categoria` on the `Productos` table. All the data in the column will be lost.
  - Added the required column `categoriaId` to the `Productos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Productos" DROP COLUMN "categoria",
ADD COLUMN     "categoriaId" "Categoria" NOT NULL;
