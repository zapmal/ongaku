/*
  Warnings:

  - A unique constraint covering the columns `[artist_id]` on the table `interaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[album_id]` on the table `interaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `interaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[song_id]` on the table `interaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_playlist_id]` on the table `interaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "interaction_artist_id_key" ON "interaction"("artist_id");

-- CreateIndex
CREATE UNIQUE INDEX "interaction_album_id_key" ON "interaction"("album_id");

-- CreateIndex
CREATE UNIQUE INDEX "interaction_user_id_key" ON "interaction"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "interaction_song_id_key" ON "interaction"("song_id");

-- CreateIndex
CREATE UNIQUE INDEX "interaction_user_playlist_id_key" ON "interaction"("user_playlist_id");
