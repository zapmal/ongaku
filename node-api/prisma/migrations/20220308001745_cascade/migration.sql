-- DropForeignKey
ALTER TABLE "album" DROP CONSTRAINT "album_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "artist" DROP CONSTRAINT "artist_band_id_fkey";

-- DropForeignKey
ALTER TABLE "artist_information" DROP CONSTRAINT "artist_information_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "artist_information" DROP CONSTRAINT "artist_information_manager_id_fkey";

-- DropForeignKey
ALTER TABLE "artist_metrics" DROP CONSTRAINT "artist_metrics_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "interaction" DROP CONSTRAINT "interaction_album_id_fkey";

-- DropForeignKey
ALTER TABLE "interaction" DROP CONSTRAINT "interaction_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "interaction" DROP CONSTRAINT "interaction_song_id_fkey";

-- DropForeignKey
ALTER TABLE "interaction" DROP CONSTRAINT "interaction_user_id_fkey";

-- DropForeignKey
ALTER TABLE "interaction" DROP CONSTRAINT "interaction_user_playlist_id_fkey";

-- DropForeignKey
ALTER TABLE "manager" DROP CONSTRAINT "manager_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "manager" DROP CONSTRAINT "manager_user_id_fkey";

-- DropForeignKey
ALTER TABLE "song" DROP CONSTRAINT "song_album_id_fkey";

-- DropForeignKey
ALTER TABLE "song_metadata" DROP CONSTRAINT "song_metadata_song_id_fkey";

-- DropForeignKey
ALTER TABLE "songs_in_playlist" DROP CONSTRAINT "songs_in_playlist_song_id_fkey";

-- DropForeignKey
ALTER TABLE "songs_in_playlist" DROP CONSTRAINT "songs_in_playlist_user_playlist_id_fkey";

-- DropForeignKey
ALTER TABLE "user_metadata" DROP CONSTRAINT "user_metadata_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_metrics" DROP CONSTRAINT "user_metrics_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_playlist" DROP CONSTRAINT "user_playlist_user_id_fkey";

-- AddForeignKey
ALTER TABLE "user_playlist" ADD CONSTRAINT "user_playlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_metadata" ADD CONSTRAINT "user_metadata_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_metrics" ADD CONSTRAINT "user_metrics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist" ADD CONSTRAINT "artist_band_id_fkey" FOREIGN KEY ("band_id") REFERENCES "band"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manager" ADD CONSTRAINT "manager_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manager" ADD CONSTRAINT "manager_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_information" ADD CONSTRAINT "artist_information_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "manager"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_information" ADD CONSTRAINT "artist_information_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_metrics" ADD CONSTRAINT "artist_metrics_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album" ADD CONSTRAINT "album_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song" ADD CONSTRAINT "song_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song_metadata" ADD CONSTRAINT "song_metadata_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interaction" ADD CONSTRAINT "interaction_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interaction" ADD CONSTRAINT "interaction_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interaction" ADD CONSTRAINT "interaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interaction" ADD CONSTRAINT "interaction_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interaction" ADD CONSTRAINT "interaction_user_playlist_id_fkey" FOREIGN KEY ("user_playlist_id") REFERENCES "user_playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "songs_in_playlist" ADD CONSTRAINT "songs_in_playlist_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "songs_in_playlist" ADD CONSTRAINT "songs_in_playlist_user_playlist_id_fkey" FOREIGN KEY ("user_playlist_id") REFERENCES "user_playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
