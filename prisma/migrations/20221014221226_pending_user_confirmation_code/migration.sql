/*
  Warnings:

  - Added the required column `confirmationCode` to the `pendingUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pendingUser" ADD COLUMN     "confirmationCode" TEXT NOT NULL;
