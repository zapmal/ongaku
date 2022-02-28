-- DropForeignKey
ALTER TABLE "interaction" DROP CONSTRAINT "interaction_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "interaction" DROP CONSTRAINT "interaction_song_id_fkey";

-- DropForeignKey
ALTER TABLE "interaction" DROP CONSTRAINT "interaction_user_id_fkey";

-- DropForeignKey
ALTER TABLE "interaction" DROP CONSTRAINT "interaction_user_playlist_id_fkey";

-- DropForeignKey
ALTER TABLE "song" DROP CONSTRAINT "song_artist_id_fkey";

-- AlterTable
ALTER TABLE "interaction" ADD COLUMN     "album_id" INTEGER,
ALTER COLUMN "artist_id" DROP NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "song_id" DROP NOT NULL,
ALTER COLUMN "user_playlist_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "interaction" ADD CONSTRAINT "interaction_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "album"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interaction" ADD CONSTRAINT "interaction_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interaction" ADD CONSTRAINT "interaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interaction" ADD CONSTRAINT "interaction_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "song"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interaction" ADD CONSTRAINT "interaction_user_playlist_id_fkey" FOREIGN KEY ("user_playlist_id") REFERENCES "user_playlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
