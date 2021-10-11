-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MODERATOR', 'MANAGER', 'USER');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(125) NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "avatar" TEXT,
    "birthdate" DATE NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'USER',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_playlist" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(125) DEFAULT E'My Playlist',
    "image" TEXT,
    "description" VARCHAR(255),
    "likes" DOUBLE PRECISION DEFAULT 0,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATE NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "user_playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_metadata" (
    "id" SERIAL NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATE NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "ip_address" VARCHAR(50) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "user_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_metrics" (
    "id" SERIAL NOT NULL,
    "most_listened_artist" VARCHAR(50),
    "most_listened_genre" VARCHAR(25),
    "total_listening_hours" DOUBLE PRECISION DEFAULT 0,
    "average_listening_time" DOUBLE PRECISION DEFAULT 0,
    "favorite_artists" JSONB,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "user_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artist" (
    "id" SERIAL NOT NULL,
    "country" VARCHAR(50) NOT NULL,
    "genres" TEXT[],
    "years_active" DATE NOT NULL,
    "artistic_name" VARCHAR(125) NOT NULL,
    "labels" TEXT[],
    "avatar" TEXT,
    "email" VARCHAR(125) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "band_id" INTEGER,

    CONSTRAINT "artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "band" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "members" TEXT[],

    CONSTRAINT "band_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artist_information" (
    "id" SERIAL NOT NULL,
    "biography" TEXT,
    "official_website" VARCHAR(50),
    "cover_image" TEXT,
    "biography_images" TEXT[],
    "artist_id" INTEGER NOT NULL,

    CONSTRAINT "artist_information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artist_metrics" (
    "id" SERIAL NOT NULL,
    "monthly_listeners" DOUBLE PRECISION,
    "followers" DOUBLE PRECISION DEFAULT 0,
    "artist_id" INTEGER NOT NULL,

    CONSTRAINT "artist_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "album" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "year" DATE NOT NULL,
    "release_type" VARCHAR(50) NOT NULL,
    "cover" TEXT NOT NULL,
    "artist_id" INTEGER NOT NULL,

    CONSTRAINT "album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "song" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(125) NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "is_explicit" BOOLEAN NOT NULL DEFAULT false,
    "path" TEXT NOT NULL,
    "album_id" INTEGER NOT NULL,
    "artist_id" INTEGER NOT NULL,

    CONSTRAINT "song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "song_metadata" (
    "id" SERIAL NOT NULL,
    "format" VARCHAR(25),
    "bitrate" VARCHAR(25),
    "performed_by" TEXT[],
    "written_by" TEXT[],
    "produced_by" TEXT[],
    "language" VARCHAR(25),
    "uploaded_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "song_id" INTEGER NOT NULL,

    CONSTRAINT "song_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "song_metrics" (
    "id" SERIAL NOT NULL,
    "play_count" DOUBLE PRECISION DEFAULT 0,
    "average_listening_time" DOUBLE PRECISION DEFAULT 0,
    "likes" DOUBLE PRECISION DEFAULT 0,
    "streams" DOUBLE PRECISION DEFAULT 0,
    "song_id" INTEGER NOT NULL,

    CONSTRAINT "song_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interaction" (
    "id" SERIAL NOT NULL,
    "liked_song" BOOLEAN,
    "liked_album" BOOLEAN,
    "liked_playlist" BOOLEAN,
    "followed_artist" BOOLEAN,
    "artist_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "song_id" INTEGER NOT NULL,
    "user_playlist_id" INTEGER NOT NULL,

    CONSTRAINT "interaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SongsInPlaylist" (
    "song_id" INTEGER NOT NULL,
    "user_playlist_id" INTEGER NOT NULL,

    CONSTRAINT "SongsInPlaylist_pkey" PRIMARY KEY ("song_id","user_playlist_id")
);

-- CreateTable
CREATE TABLE "_ArtistToSong" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_metadata_user_id_key" ON "user_metadata"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_metrics_user_id_key" ON "user_metrics"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "artist_email_key" ON "artist"("email");

-- CreateIndex
CREATE UNIQUE INDEX "artist_information_artist_id_key" ON "artist_information"("artist_id");

-- CreateIndex
CREATE UNIQUE INDEX "artist_metrics_artist_id_key" ON "artist_metrics"("artist_id");

-- CreateIndex
CREATE UNIQUE INDEX "song_metadata_song_id_key" ON "song_metadata"("song_id");

-- CreateIndex
CREATE UNIQUE INDEX "song_metrics_song_id_key" ON "song_metrics"("song_id");

-- CreateIndex
CREATE UNIQUE INDEX "_ArtistToSong_AB_unique" ON "_ArtistToSong"("A", "B");

-- CreateIndex
CREATE INDEX "_ArtistToSong_B_index" ON "_ArtistToSong"("B");

-- AddForeignKey
ALTER TABLE "user_playlist" ADD CONSTRAINT "user_playlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_metadata" ADD CONSTRAINT "user_metadata_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_metrics" ADD CONSTRAINT "user_metrics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist" ADD CONSTRAINT "artist_band_id_fkey" FOREIGN KEY ("band_id") REFERENCES "band"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_information" ADD CONSTRAINT "artist_information_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_metrics" ADD CONSTRAINT "artist_metrics_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album" ADD CONSTRAINT "album_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song" ADD CONSTRAINT "song_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song" ADD CONSTRAINT "song_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song_metadata" ADD CONSTRAINT "song_metadata_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song_metrics" ADD CONSTRAINT "song_metrics_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interaction" ADD CONSTRAINT "interaction_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interaction" ADD CONSTRAINT "interaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interaction" ADD CONSTRAINT "interaction_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interaction" ADD CONSTRAINT "interaction_user_playlist_id_fkey" FOREIGN KEY ("user_playlist_id") REFERENCES "user_playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongsInPlaylist" ADD CONSTRAINT "SongsInPlaylist_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongsInPlaylist" ADD CONSTRAINT "SongsInPlaylist_user_playlist_id_fkey" FOREIGN KEY ("user_playlist_id") REFERENCES "user_playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistToSong" ADD FOREIGN KEY ("A") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistToSong" ADD FOREIGN KEY ("B") REFERENCES "song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
