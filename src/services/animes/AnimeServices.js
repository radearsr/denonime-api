const { PrismaClient } = require("@prisma/client");
const slugs = require("slugs");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

const prisma = new PrismaClient();

exports.addNewAnime = async (payload) => {
  const slug = slugs(payload.title);
  const addedAnime = await prisma.animes.create({
    data: {
      title: payload.title,
      description: payload.description,
      poster: payload.poster,
      type: payload.type,
      releaseDate: new Date().toISOString(),
      status: payload.status,
      slug,
    },
  });
  if (!addedAnime?.animeId) throw new InvariantError("Gagal menambahkan anime");
  return {
    animeId: addedAnime.animeId,
    slug: addedAnime.slug,
  };
};

exports.addAnimeGenres = async (genres, animeId) => {
  const splitedGenre = genres.split(",");
  const matchesGenre = await Promise.all(splitedGenre.map(async (genre) => {
    const result = await prisma.genres.findFirst({
      where: { name: genre.trim() },
    });
    if (result) {
      return { animeId, genreId: result.genreId };
    }
    return "";
  }));
  const matchesGenreFiltered = matchesGenre.filter((data) => data !== "");
  await prisma.anime_genres.createMany({
    data: matchesGenreFiltered,
  });
};

exports.verifyAnimeId = async (animeId) => {
  const result = await prisma.animes.findUnique({
    where: { animeId: parseFloat(animeId) },
  });
  if (!result) throw new NotFoundError("ID anime tidak ditemukan");
};

exports.updateAnime = async (payload, animeId) => {
  const slug = slugs(payload.title);
  const updatedAnime = await prisma.animes.update({
    where: {
      animeId: parseFloat(animeId),
    },
    data: {
      title: payload.title,
      description: payload.description,
      poster: payload.poster,
      type: payload.type,
      releaseDate: new Date().toISOString(),
      status: payload.status,
      slug,
    },
  });
  if (!updatedAnime?.animeId) throw new InvariantError("Gagal memperbarui anime");
  console.log(updatedAnime);
  return {
    animeId: updatedAnime.animeId,
    slug: updatedAnime.slug,
  };
};

exports.updateAnimeGenres = async (genres, animeId) => {
  const splitedGenre = genres.split(",");
  const inIdGenres = [];
  const matchesGenre = await Promise.all(splitedGenre.map(async (genre) => {
    const result = await prisma.genres.findFirst({
      where: { name: genre.trim() },
    });
    if (result) {
      inIdGenres.push(result.genreId);
      return { animeId: parseFloat(animeId), genreId: result.genreId };
    }
    return "";
  }));
  const filteredMatcheGenre = matchesGenre.filter((genre) => genre !== "");

  const willBeInsert = await Promise.all(filteredMatcheGenre.map(async (genre) => {
    const result = await prisma.anime_genres.findFirst({
      select: { animeId: true, genreId: true },
      where: { animeId: genre.animeId, genreId: genre.genreId },
    });
    if (!result) {
      return { animeId: genre.animeId, genreId: genre.genreId };
    }
    return "";
  }));

  const filteredWillBeInsert = willBeInsert.filter((willInsert) => willInsert !== "");

  await prisma.anime_genres.createMany({
    data: filteredWillBeInsert,
  });

  if (inIdGenres.length >= 1) {
    await prisma.anime_genres.deleteMany({
      where: { genreId: { notIn: inIdGenres }, animeId: parseFloat(animeId) },
    });
  }
};
