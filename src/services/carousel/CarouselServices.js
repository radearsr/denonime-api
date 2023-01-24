const { PrismaClient } = require("@prisma/client");
const slugs = require("slugs");
const InvariantError = require("../../exceptions/InvariantError");

const prisma = new PrismaClient();

exports.postAddCarousel = async (payload) => {
  const slug = slugs(payload.title);
  const addedCarousel = await prisma.carousel.create({
    data: {
      title: payload.title,
      description: payload.description,
      slug,
      poster: payload.poster,
      background: payload.background,
      episodes: payload.episodes,
      animeId: payload.animeId,
      releaseDate: new Date().toISOString(),
      type: payload.type,
    },
  });
  if (!addedCarousel.id) {
    throw new InvariantError("Gagal menambahkan carousel ke database");
  }
  return {
    id: addedCarousel.id,
    title: addedCarousel.title,
  };
};
