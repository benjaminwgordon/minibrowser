/*
  Warnings:

  - You are about to drop the column `iconURL` on the `technique` table. All the data in the column will be lost.
  - You are about to drop the column `iconURL` on the `tool` table. All the data in the column will be lost.
  - Added the required column `iconSVG` to the `technique` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iconSVG` to the `tool` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "technique" DROP COLUMN "iconURL",
ADD COLUMN     "iconSVG" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tool" DROP COLUMN "iconURL",
ADD COLUMN     "iconSVG" TEXT NOT NULL;
