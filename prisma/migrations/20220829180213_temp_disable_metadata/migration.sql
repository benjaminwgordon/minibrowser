/*
  Warnings:

  - You are about to drop the column `blurb` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `isWIP` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `miniatureId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `recipeId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `Miniature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recipe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecipeStep` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_miniatureId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeStep" DROP CONSTRAINT "RecipeStep_recipeId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "blurb",
DROP COLUMN "isWIP",
DROP COLUMN "miniatureId",
DROP COLUMN "recipeId",
ADD COLUMN     "description" TEXT;

-- DropTable
DROP TABLE "Miniature";

-- DropTable
DROP TABLE "Recipe";

-- DropTable
DROP TABLE "RecipeStep";
