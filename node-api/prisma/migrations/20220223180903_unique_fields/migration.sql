/*
  Warnings:

  - A unique constraint covering the columns `[artist_id]` on the table `album` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[band_id]` on the table `artist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[album_id]` on the table `song` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[artist_id]` on the table `song` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[song_id]` on the table `songs_in_playlist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_playlist_id]` on the table `songs_in_playlist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `user_playlist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "album_artist_id_key" ON "album"("artist_id");

-- CreateIndex
CREATE UNIQUE INDEX "artist_band_id_key" ON "artist"("band_id");

-- CreateIndex
CREATE UNIQUE INDEX "song_album_id_key" ON "song"("album_id");

-- CreateIndex
CREATE UNIQUE INDEX "song_artist_id_key" ON "song"("artist_id");

-- CreateIndex
CREATE UNIQUE INDEX "songs_in_playlist_song_id_key" ON "songs_in_playlist"("song_id");

-- CreateIndex
CREATE UNIQUE INDEX "songs_in_playlist_user_playlist_id_key" ON "songs_in_playlist"("user_playlist_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_playlist_user_id_key" ON "user_playlist"("user_id");
