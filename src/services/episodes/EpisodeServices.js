const { PrismaClient } = require("@prisma/client");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

const prisma = new PrismaClient();

exports.addNewEpisode = async (payload) => {
  const addedEpisode = await prisma.episodes.create({
    data: {
      numEpisode: parseFloat(payload.numEpisode),
      source360p: payload.source360p,
      source480p: payload.source480p,
      source720p: payload.source720p,
      animeId: parseFloat(payload.animeId),
      publish: payload.publishStatus,
    },
  });
  if (addedEpisode.id < 1) throw new InvariantError("Gagal menambahkan episode ke database");
  return {
    animeId: addedEpisode.animeId,
    episodeId: addedEpisode.id,
    numEpisode: addedEpisode.numEpisode,
  };
};

exports.verifyEpisodeId = async (episodeId) => {
  const filteredEpisode = await prisma.episodes.findUnique({
    where: { id: parseFloat(episodeId) },
  });
  if (!filteredEpisode) throw new NotFoundError("ID episode tidak ditemukan");
};

exports.editEpisode = async (payload, episodeId) => {
  const editedEpisode = await prisma.episodes.update({
    data: {
      numEpisode: parseFloat(payload.numEpisode),
      source360p: payload.source360p,
      source480p: payload.source480p,
      source720p: payload.source720p,
      animeId: parseFloat(payload.animeId),
      publish: payload.publishStatus,
    },
    where: {
      id: parseFloat(episodeId),
    },
  });
  if (editedEpisode.id < 1) throw new InvariantError("Gagal memperbarui episode");
  return {
    animeId: editedEpisode.animeId,
    episodeId: editedEpisode.id,
    numEpisode: editedEpisode.numEpisode,
  };
};

exports.deleteEpisode = async (episodeId) => {
  const deletedEpisode = await prisma.episodes.delete({
    where: { id: parseFloat(episodeId) },
  });
  if (deletedEpisode.count < 1) throw new InvariantError("Gagal menghapus data episode");
};

exports.readEpisodeByEpisodeId = async (episodeId) => {
  const episode = await prisma.episodes.findUnique({
    where: { id: parseFloat(episodeId) },
  });
  return episode;
};

exports.readAllEpisodesByAnimeId = async (animeId) => {
  const episodes = await prisma.episodes.findMany({
    where: {
      animeId,
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
