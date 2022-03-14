-- CreateTable
CREATE TABLE "room" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL DEFAULT E'My Room',
    "limit" INTEGER NOT NULL DEFAULT 0,
    "host" INTEGER NOT NULL,
    "genres" TEXT[],
    "users" INTEGER[],
    "queue" JSONB NOT NULL,

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "room_key_key" ON "room"("key");

-- CreateIndex
CREATE UNIQUE INDEX "room_host_key" ON "room"("host");

-- AddForeignKey
ALTER TABLE "room" ADD CONSTRAINT "room_host_fkey" FOREIGN KEY ("host") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
