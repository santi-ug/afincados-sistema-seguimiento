/*
  Warnings:

  - The values [Condimentos,Hierbas,Reposteria] on the enum `Categoria` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Categoria_new" AS ENUM ('CONDIMENTO', 'HIERBAS', 'REPOSTERIA');
ALTER TABLE "Productos" ALTER COLUMN "categoria" TYPE "Categoria_new" USING ("categoria"::text::"Categoria_new");
ALTER TYPE "Categoria" RENAME TO "Categoria_old";
ALTER TYPE "Categoria_new" RENAME TO "Categoria";
DROP TYPE "Categoria_old";
COMMIT;
