/*
  Warnings:

  - You are about to drop the column `notes` on the `RecipeStep` table. All the data in the column will be lost.
  - Added the required column `instruction` to the `RecipeStep` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecipeStep" DROP COLUMN "notes",
ADD COLUMN     "instruction" TEXT NOT NULL;
