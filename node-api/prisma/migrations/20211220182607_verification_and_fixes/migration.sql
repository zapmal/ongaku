/*
  Warnings:

  - Added the required column `verified_email` to the `artist` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `years_active` on the `artist` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `verified_email` to the `user_metadata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "artist" ADD COLUMN     "verified_email" BOOLEAN NOT NULL,
DROP COLUMN "years_active",
ADD COLUMN     "years_active" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user_metadata" ADD COLUMN     "verified_email" BOOLEAN NOT NULL;
