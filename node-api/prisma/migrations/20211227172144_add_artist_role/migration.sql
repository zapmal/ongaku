/*
  Warnings:

  - Added the required column `role` to the `artist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ARTIST';

-- DropForeignKey
ALTER TABLE "song" DROP CONSTRAINT "song_artist_id_fkey";

-- AlterTable
ALTER TABLE "artist" ADD COLUMN     "role" "Role" NOT NULL;

-- AddForeignKey
ALTER TABLE "song" ADD FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
