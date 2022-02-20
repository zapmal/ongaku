/*
  Warnings:

  - You are about to drop the column `description` on the `user_playlist` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `user_playlist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_playlist" DROP COLUMN "description",
DROP COLUMN "image",
ADD COLUMN     "background" TEXT,
ADD COLUMN     "cover" TEXT;
