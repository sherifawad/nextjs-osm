/*
  Warnings:

  - A unique constraint covering the columns `[latitude,longitude,verified]` on the table `Place` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "blocked" BOOLEAN NOT NULL DEFAULT false;

