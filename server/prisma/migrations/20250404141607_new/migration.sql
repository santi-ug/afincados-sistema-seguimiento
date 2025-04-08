/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Categorias` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `name` on the `Categorias` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `categoria` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('Condimentos', 'Hierbas', 'Reposteria');

-- AlterTable
ALTER TABLE "Categorias" DROP COLUMN "name",
ADD COLUMN     "name" "Categoria" NOT NULL;

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "categoria" "Categoria" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Categorias_name_key" ON "Categorias"("name");
