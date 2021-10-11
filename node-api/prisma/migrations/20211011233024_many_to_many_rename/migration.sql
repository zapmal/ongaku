/*
  Warnings:

  - You are about to drop the `SongsInPlaylist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SongsInPlaylist" DROP CONSTRAINT "SongsInPlaylist_song_id_fkey";

-- DropForeignKey
ALTER TABLE "SongsInPlaylist" DROP CONSTRAINT "SongsInPlaylist_user_playlist_id_fkey";

-- DropTable
DROP TABLE "SongsInPlaylist";

-- CreateTable
CREATE TABLE "songs_in_playlist" (
    "song_id" INTEGER NOT NULL,
    "user_playlist_id" INTEGER NOT NULL,

    CONSTRAINT "songs_in_playlist_pkey" PRIMARY KEY ("song_id","user_playlist_id")
);

-- AddForeignKey
ALTER TABLE "songs_in_playlist" ADD CONSTRAINT "songs_in_playlist_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "songs_in_playlist" ADD CONSTRAINT "songs_in_playlist_user_playlist_id_fkey" FOREIGN KEY ("user_playlist_id") REFERENCES "user_playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
