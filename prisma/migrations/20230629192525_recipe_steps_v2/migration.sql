/*
  Warnings:

  - You are about to drop the column `instruction` on the `RecipeStep` table. All the data in the column will be lost.
  - Added the required column `notes` to the `RecipeStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paintId` to the `RecipeStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `techniqueId` to the `RecipeStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toolId` to the `RecipeStep` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecipeStep" DROP COLUMN "instruction",
ADD COLUMN     "notes" TEXT NOT NULL,
ADD COLUMN     "paintId" INTEGER NOT NULL,
ADD COLUMN     "techniqueId" INTEGER NOT NULL,
ADD COLUMN     "toolId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "paint" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "hexColor" CHAR(6) NOT NULL,

    CONSTRAINT "paint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tool" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "iconURL" TEXT NOT NULL,

    CONSTRAINT "tool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technique" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "iconURL" TEXT NOT NULL,

    CONSTRAINT "technique_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "paint_name_key" ON "paint"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tool_name_key" ON "tool"("name");

-- CreateIndex
CREATE UNIQUE INDEX "technique_name_key" ON "technique"("name");

-- AddForeignKey
ALTER TABLE "RecipeStep" ADD CONSTRAINT "RecipeStep_techniqueId_fkey" FOREIGN KEY ("techniqueId") REFERENCES "technique"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeStep" ADD CONSTRAINT "RecipeStep_paintId_fkey" FOREIGN KEY ("paintId") REFERENCES "paint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeStep" ADD CONSTRAINT "RecipeStep_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
