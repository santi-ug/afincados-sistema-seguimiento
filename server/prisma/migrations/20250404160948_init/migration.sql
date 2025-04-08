/*
  Warnings:

  - You are about to drop the column `categoriaId` on the `Productos` table. All the data in the column will be lost.
  - You are about to drop the `Categorias` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoria` to the `Productos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Categoria" ADD VALUE 'nmmmmmm';

-- AlterTable
ALTER TABLE "Productos" DROP COLUMN "categoriaId",
ADD COLUMN     "categoria" "Categoria" NOT NULL;

-- DropTable
DROP TABLE "Categorias";
