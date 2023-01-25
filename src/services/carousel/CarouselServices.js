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

exports.readAllCarousel = async (sortby, currentPage, pageSize) => {
  if (sortby !== "release" && sortby !== "created" && sortby !== "title") {
    throw new InvariantError("Sorting tidak tersedia silahkan gunakan release, created, atau title");
  }

  const createdOrderByMethod = (sortStr) => {
    if (sortStr === "release") {
      return { releaseDate: "asc" };
    }
    if (sortStr === "created") {
      return { createdAt: "desc" };
    }
    if (sortStr === "title") {
      return { title: "asc" };
    }
    throw new InvariantError("Metode sorting tidak terdaftar");
  };

  const totalCarousel = await prisma.animes.count({
    orderBy: { ...createdOrderByMethod(sortby) },
  });

  const totalPage = Math.ceil(totalCarousel / parseFloat(pageSize));
  const skipedData = (currentPage * pageSize) - pageSize;

  const carousel = await prisma.carousel.findMany({
    skip: skipedData,
    take: parseFloat(pageSize),
    orderBy: { ...createdOrderByMethod(sortby) },
  });

  if (carousel.length < 1) {
    throw new NotFoundError("Carousel tidak ditemukan");
  }

  return {
    pages: {
      totalPage,
      currentPage: parseFloat(currentPage),
      pageSize: parseFloat(pageSize),
    },
    data: {
      carousel,
    },
  };
};
