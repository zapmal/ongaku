/*
  Warnings:

  - You are about to drop the column `followed_artist` on the `interaction` table. All the data in the column will be lost.
  - You are about to drop the column `liked_album` on the `interaction` table. All the data in the column will be lost.
  - You are about to drop the column `liked_playlist` on the `interaction` table. All the data in the column will be lost.
  - You are about to drop the column `liked_song` on the `interaction` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "interaction_album_id_key";

-- DropIndex
DROP INDEX "interaction_artist_id_key";

-- DropIndex
DROP INDEX "interaction_song_id_key";

-- DropIndex
DROP INDEX "interaction_user_id_key";

-- DropIndex
DROP INDEX "interaction_user_playlist_id_key";

-- AlterTable
ALTER TABLE "interaction" DROP COLUMN "followed_artist",
DROP COLUMN "liked_album",
DROP COLUMN "liked_playlist",
DROP COLUMN "liked_song",
ADD COLUMN     "value" BOOLEAN;
