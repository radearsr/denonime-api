const { PrismaClient } = require("@prisma/client");
const slugs = require("slugs");
const InvariantError = require("../../exceptions/InvariantError");

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

exports.addGenre = async (genres, animeId) => {
  const splitedGenre = genres.split(",");
  const dataGenre = await Promise.all(splitedGenre.map(async (genre) => {
    const result = await prisma.genres.findFirst({
      where: { name: genre.trim() },
    });
    if (result) {
      return { animeId, genreId: result.genreId };
    }
    return "";
  }));
  const dataGenreFiltered = dataGenre.filter((data) => data !== "");
  await prisma.anime_genres.createMany({
    data: dataGenreFiltered,
  });
};
