const { PrismaClient } = require("@prisma/client");
const slugs = require("slugs");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

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

exports.verifyCarouselId = async (carouselId) => {
  const result = await prisma.carousel.findUnique({
    where: {
      id: parseFloat(carouselId),
    },
  });
  if (!result) throw new NotFoundError("ID carousel tidak ditemukan");
};

exports.editCarousel = async (payload, carouselId) => {
  const slug = slugs(payload.title);
  const editedCarousel = await prisma.carousel.update({
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
    where: {
      id: parseFloat(carouselId),
    },
  });
  if (!editedCarousel.id) {
    throw new InvariantError("Gagal memperbarui carousel");
  }
  return {
    id: editedCarousel.id,
    title: editedCarousel.title,
  };
};

exports.deleteCarouselById = async (carouselId) => {
  await prisma.carousel.delete({
    where: {
      id: parseFloat(carouselId),
    },
  });
};
