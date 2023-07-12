const { PrismaClient } = require("@prisma/client");
const slugs = require("slugs");
const InvariantError = require("../../../exceptions/InvariantError");
const NotFoundError = require("../../../exceptions/NotFoundError");

const prisma = new PrismaClient();

exports.createAnime = async (payload) => {
  const createdAnime = await prisma.animes.create({
    data: {
      title: payload.title,
      rating: payload.rating,
      synopsis: payload.synopsis,
      poster: payload.poster,
      anime_slug: slugs(payload.title),
      release_date: new Date(payload.release_date),
      status: payload.status,
      published: payload.published,
    },
  });
  if (!createdAnime) throw new InvariantError("Gagal menambahkan anime");
  return createdAnime;
};

exports.createAnimeGenres = async (genres, animeId) => {
  const splitedGenres = genres.split(",") || genres;
  const genresPayload = await Promise.all(splitedGenres.map(async (genreName) => {
    const result = await prisma.genres.findFirst({
      where: {
        name: {
          equals: genreName.toLowerCase().trim(),
          mode: "insensitive",
        },
      },
    });
    if (result) {
      return {
        genre_id: result.id,
        anime_id: animeId,
      };
    }
    return undefined;
  }));
  const createdGenres = await prisma.anime_genres.createMany({
    data: genresPayload,
  });
  if (!createdGenres.count) throw new InvariantError("Gagal menambahkan genre pada anime");
};

exports.verifyAnimeId = async (animeId) => {
  if (!animeId) throw new InvariantError("ID anime yang anda masukkan tidak sesuai");
  const resultAnimeId = await prisma.animes.findUnique({
    where: { id: animeId },
  });
  if (!resultAnimeId) throw new NotFoundError("ID anime tidak ditemukan");
};

exports.updateAnimeById = async (animeId, payload) => {
  const updatedAnime = await prisma.animes.update({
    where: {
      id: animeId,
    },
    data: {
      title: payload.title,
      rating: payload.rating,
      synopsis: payload.synopsis,
      poster: payload.poster,
      anime_slug: slugs(payload.title),
      release_date: new Date(payload.release_date),
      status: payload.status,
      published: payload.published,
    },
  });
  if (!updatedAnime.id) throw new InvariantError("Gagal memperbarui anime");
  return updatedAnime;
};

exports.deleteAnimeAndGenres = async (animeId) => {
  const deletedAnimeAndGenres = await prisma.$transaction([
    prisma.anime_genres.deleteMany({
      where: {
        anime_id: animeId,
      },
    }),
    prisma.animes.delete({
      where: {
        id: animeId,
      },
    }),
  ]);
  if (!deletedAnimeAndGenres) throw new InvariantError("Gagal menghapus anime");
  return deletedAnimeAndGenres[1];
};

exports.createAnimeDetailSources = async (payload) => {
  const createdDetail = await prisma.anime_detail_sources.create({
    data: {
      anime_id: payload.anime_id,
      url_source: payload.url_source,
      scraping_strategy: payload.scraping_strategy,
    },
  });
  if (!createdDetail) throw new InvariantError("Gagal membuat anime detail sources");
};
