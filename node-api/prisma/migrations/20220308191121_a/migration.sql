/*
  Warnings:

  - You are about to drop the column `artist_id` on the `song` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "songs_in_playlist_song_id_key";

-- DropIndex
DROP INDEX "songs_in_playlist_user_playlist_id_key";

-- AlterTable
ALTER TABLE "song" DROP COLUMN "artist_id";
