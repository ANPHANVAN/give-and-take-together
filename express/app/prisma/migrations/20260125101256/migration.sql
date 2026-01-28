/*
  Warnings:

  - You are about to alter the column `givenCount` on the `User` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `receivedCount` on the `User` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "givenCount" SET DATA TYPE INTEGER,
ALTER COLUMN "receivedCount" SET DATA TYPE INTEGER;
