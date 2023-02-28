const { PrismaClient } = require("@prisma/client");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

const prisma = new PrismaClient();

exports.addNewEpisode = async (payload) => {
  const addedEpisode = await prisma.episodes.create({
    data: {
      numEpisode: payload.numEpisode,
      source360p: payload.source360p,
      source480p: payload.source480p,
      source720p: payload.source720p,
      result360p: payload.result360p,
      result480p: payload.result480p,
      result720p: payload.result720p,
      animeId: payload.animeId,
      published: payload.published,
    },
  });
  if (!addedEpisode.id) throw new InvariantError("Gagal menambahkan episode ke database");
  return {
    animeId: addedEpisode.animeId,
    episodeId: addedEpisode.id,
    numEpisode: addedEpisode.numEpisode,
  };
};

exports.verifyEpisodeId = async (episodeId) => {
  const filteredEpisode = await prisma.episodes.findUnique({
    where: { id: episodeId },
  });
  if (!filteredEpisode) throw new NotFoundError("ID episode tidak ditemukan");
};

exports.editEpisode = async (payload, episodeId) => {
  const editedEpisode = await prisma.episodes.update({
    data: {
      animeId: payload.animeId,
      numEpisode: payload.numEpisode,
      source360p: payload.source360p,
      source480p: payload.source480p,
      source720p: payload.source720p,
      result360p: payload.result360p,
      result480p: payload.result480p,
      result720p: payload.result720p,
      published: payload.published,
    },
    where: {
      id: episodeId,
    },
  });
  if (!editedEpisode.id) throw new InvariantError("Gagal memperbarui episode");
  return {
    animeId: editedEpisode.animeId,
    episodeId: editedEpisode.id,
    numEpisode: editedEpisode.numEpisode,
  };
};

exports.deleteEpisode = async (episodeId) => {
  const deletedEpisode = await prisma.episodes.delete({
    where: { id: episodeId },
  });
  if (deletedEpisode.count < 1) throw new InvariantError("Gagal menghapus data episode");
};

exports.readEpisodeByEpisodeId = async (episodeId) => {
  const episode = await prisma.episodes.findUnique({
    where: { id: episodeId },
  });
  return episode;
};

exports.readAllEpisodesByAnimeId = async (animeId, sortBy) => {
  const episodes = await prisma.episodes.findMany({
    where: {
      animeId,
    },
    orderBy: {
      numEpisode: sortBy,
    },
  });
  if (episodes.length < 1) throw new NotFoundError("Episode tidak ditemukan");
  return episodes;
};

exports.readAllEpisodesWithPagin = async (currentPage, pageSize) => {
  const totalEpisodes = await prisma.episodes.count();

  const totalPage = Math.ceil(totalEpisodes / parseFloat(pageSize));
  const skipedData = (currentPage * pageSize) - pageSize;

  const episodes = await prisma.episodes.findMany({
    take: parseFloat(pageSize),
    skip: parseFloat(skipedData),
    orderBy: { createdAt: "desc" },
  });
  if (episodes.length < 1) throw new NotFoundError("Episode tidak ditemukan");
  return {
    data: episodes,
    pages: {
      pageSize: parseFloat(pageSize),
      currentPage: parseFloat(currentPage),
      totalCount: totalEpisodes,
      totalPage,
    },
  };
};
