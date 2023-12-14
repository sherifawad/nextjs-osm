/*
  Warnings:

  - A unique constraint covering the columns `[latitude,longitude,verified]` on the table `Place` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PlaceRating" DROP CONSTRAINT "PlaceRating_placeId_fkey";

-- DropForeignKey
ALTER TABLE "PlaceRating" DROP CONSTRAINT "PlaceRating_userId_fkey";

-- AddForeignKey
ALTER TABLE "PlaceRating" ADD CONSTRAINT "PlaceRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceRating" ADD CONSTRAINT "PlaceRating_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
