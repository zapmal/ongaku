/*
  Warnings:

  - You are about to drop the column `biography_images` on the `artist_information` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "artist_information" DROP COLUMN "biography_images",
ADD COLUMN     "biography_image" TEXT;
