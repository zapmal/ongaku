/*
  Warnings:

  - A unique constraint covering the columns `[artistic_name]` on the table `artist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `band` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "artist_artistic_name_key" ON "artist"("artistic_name");

-- CreateIndex
CREATE UNIQUE INDEX "band_name_key" ON "band"("name");
