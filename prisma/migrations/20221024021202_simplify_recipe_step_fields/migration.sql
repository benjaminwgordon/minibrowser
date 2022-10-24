/*
  Warnings:

  - You are about to drop the column `ingredient` on the `RecipeStep` table. All the data in the column will be lost.
  - You are about to drop the column `technique` on the `RecipeStep` table. All the data in the column will be lost.
  - You are about to drop the column `tool` on the `RecipeStep` table. All the data in the column will be lost.
  - Added the required column `instruction` to the `RecipeStep` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecipeStep" DROP COLUMN "ingredient",
DROP COLUMN "technique",
DROP COLUMN "tool",
ADD COLUMN     "instruction" TEXT NOT NULL;
