-- CreateEnum
CREATE TYPE "StatusUpdate" AS ENUM ('Ongoing', 'Completed');

-- CreateEnum
CREATE TYPE "AnimeType" AS ENUM ('Movie', 'Series');

-- CreateEnum
CREATE TYPE "EpisodeType" AS ENUM ('Tv', 'Ova');

-- CreateEnum
CREATE TYPE "StatusPublish" AS ENUM ('Publish', 'NonPublish');

-- CreateEnum
CREATE TYPE "streamType" AS ENUM ('Otakudesu', 'OwnServer');

-- CreateTable
CREATE TABLE "roles" (
    "roleId" SERIAL NOT NULL,
    "name" VARCHAR(50),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("roleId")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "username" VARCHAR(255),
    "password" TEXT,
    "email" VARCHAR(200),
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authentications" (
    "token" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "animes" (
    "animeId" SERIAL NOT NULL,
    "title" VARCHAR(100),
    "rating" INTEGER NOT NULL,
    "description" TEXT,
    "poster" VARCHAR(100),
    "type" "AnimeType" NOT NULL DEFAULT 'Series',
    "originalSource" VARCHAR(100) NOT NULL,
    "releaseDate" DATE NOT NULL,
    "status" "StatusUpdate" NOT NULL DEFAULT 'Completed',
    "slug" VARCHAR(100),
    "publish" "StatusPublish" NOT NULL DEFAULT 'Publish',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "animes_pkey" PRIMARY KEY ("animeId")
);

-- CreateTable
CREATE TABLE "genres" (
    "genreId" SERIAL NOT NULL,
    "name" VARCHAR(50),

    CONSTRAINT "genres_pkey" PRIMARY KEY ("genreId")
);

-- CreateTable
CREATE TABLE "anime_genres" (
    "id" SERIAL NOT NULL,
    "animeId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,

    CONSTRAINT "anime_genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "episodes" (
    "id" SERIAL NOT NULL,
    "episodeType" "EpisodeType" NOT NULL DEFAULT 'Tv',
    "streamStrategy" "streamType" NOT NULL DEFAULT 'OwnServer',
    "numEpisode" INTEGER NOT NULL,
    "sourceDefault" VARCHAR(200) NOT NULL,
    "sourceHd" VARCHAR(200) NOT NULL,
    "animeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publish" "StatusPublish" NOT NULL DEFAULT 'Publish',

    CONSTRAINT "episodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carousel" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "type" "AnimeType" NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "poster" VARCHAR(100) NOT NULL,
    "background" VARCHAR(100) NOT NULL,
    "releaseDate" DATE NOT NULL,
    "animeId" INTEGER NOT NULL,
    "published" "StatusPublish" NOT NULL DEFAULT 'Publish',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carousel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "authentications_token_key" ON "authentications"("token");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("roleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_genres" ADD CONSTRAINT "anime_genres_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "animes"("animeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_genres" ADD CONSTRAINT "anime_genres_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "genres"("genreId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "animes"("animeId") ON DELETE RESTRICT ON UPDATE CASCADE;
