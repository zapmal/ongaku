/*
  Warnings:

  - Added the required column `artist_id` to the `song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "song" ADD COLUMN     "artist_id" INTEGER NOT NULL;
