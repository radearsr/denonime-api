-- CreateEnum
CREATE TYPE "AnimeStatus" AS ENUM ('ONGOING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "AnimeType" AS ENUM ('MOVIES', 'SERIES');

-- CreateEnum
CREATE TYPE "EpisodeType" AS ENUM ('TV', 'MV', 'OVA');

-- CreateEnum
CREATE TYPE "ScrapingStrategy" AS ENUM ('ANIMEINDO', 'OTAKUDESU', 'CUSTOM');

-- CreateEnum
CREATE TYPE "LabelEpisodeSources" AS ENUM ('HD', 'DEFAULT');

-- CreateTable
CREATE TABLE "animes" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100),
    "rating" DOUBLE PRECISION NOT NULL,
    "synopsis" TEXT NOT NULL,
    "poster" VARCHAR NOT NULL,
    "anime_slug" VARCHAR(100) NOT NULL,
    "release_date" DATE NOT NULL,
    "published" BOOLEAN NOT NULL,
    "status" "AnimeStatus" NOT NULL DEFAULT 'COMPLETED',
    "anime_type" "AnimeType" NOT NULL DEFAULT 'SERIES',
    "last_episode_update" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "animes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "episodes" (
    "id" SERIAL NOT NULL,
    "episode_slug" VARCHAR(100),
    "episode_type" "EpisodeType" DEFAULT 'TV',
    "number_episode" INTEGER,
    "url_source" VARCHAR(100),
    "published" BOOLEAN NOT NULL,
    "anime_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "episodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "episode_sources" (
    "id" SERIAL NOT NULL,
    "label" "LabelEpisodeSources" NOT NULL DEFAULT 'DEFAULT',
    "detail_source" VARCHAR(100),
    "scraping_strategy" "ScrapingStrategy" NOT NULL DEFAULT 'CUSTOM',
    "anime_id" INTEGER NOT NULL,
    "episode_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "episode_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anime_detail_sources" (
    "id" SERIAL NOT NULL,
    "url_source" VARCHAR(100),
    "scraping_strategy" "ScrapingStrategy" NOT NULL DEFAULT 'CUSTOM',
    "anime_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anime_detail_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genres" (
    "id" SERIAL NOT NULL,
    "genre_slug" VARCHAR(50),
    "name" VARCHAR(50),

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anime_genres" (
    "id" SERIAL NOT NULL,
    "anime_id" INTEGER NOT NULL,
    "genre_id" INTEGER NOT NULL,

    CONSTRAINT "anime_genres_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "animes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episode_sources" ADD CONSTRAINT "episode_sources_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "animes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episode_sources" ADD CONSTRAINT "episode_sources_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "episodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_detail_sources" ADD CONSTRAINT "anime_detail_sources_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "animes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_genres" ADD CONSTRAINT "anime_genres_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "animes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_genres" ADD CONSTRAINT "anime_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
