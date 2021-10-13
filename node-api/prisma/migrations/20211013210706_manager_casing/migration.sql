/*
  Warnings:

  - You are about to drop the `Manager` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Manager" DROP CONSTRAINT "Manager_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "Manager" DROP CONSTRAINT "Manager_user_id_fkey";

-- DropForeignKey
ALTER TABLE "artist_information" DROP CONSTRAINT "artist_information_manager_id_fkey";

-- DropTable
DROP TABLE "Manager";

-- CreateTable
CREATE TABLE "manager" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "artist_id" INTEGER,

    CONSTRAINT "manager_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "manager_user_id_key" ON "manager"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "manager_artist_id_key" ON "manager"("artist_id");

-- AddForeignKey
ALTER TABLE "manager" ADD CONSTRAINT "manager_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manager" ADD CONSTRAINT "manager_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_information" ADD CONSTRAINT "artist_information_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "manager"("id") ON DELETE SET NULL ON UPDATE CASCADE;
