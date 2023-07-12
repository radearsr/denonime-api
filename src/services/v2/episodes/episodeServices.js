const { PrismaClient } = require("@prisma/client");
const InvariantError = require("../../../exceptions/InvariantError");
const NotFoundError = require("../../../exceptions/NotFoundError");

const prisma = new PrismaClient();

exports.createEpisode = async (payload) => {
  const createdEpisode = await prisma.episodes.create({
    data: {
      episode_slug: payload.episode_slug,
      episode_type: payload.episode_type,
      number_episode: payload.number_episode,
      url_source: payload.url_source,
      anime_id: payload.anime_id,
      published: payload.published,
    },
  });
  if (!createdEpisode) throw new InvariantError("Gagal menambahkan episode baru");
  return createdEpisode;
};

exports.verifyEpisodeId = async (episodeId) => {
  if (!episodeId) throw new InvariantError("ID episode yang anda masukkan tidak sesuai");
  const resultEpisodeId = await prisma.episodes.findUnique({
    where: {
      id: episodeId,
    },
  });
  if (!resultEpisodeId) throw new NotFoundError("ID episode tidak ditemukan");
};

exports.updateEpisode = async (episodeId, payload) => {
  const updatedEpisode = await prisma.episodes.update({
    where: {
      id: episodeId,
    },
    data: {
      episode_slug: payload.episode_slug,
      episode_type: payload.episode_type,
      number_episode: payload.number_episode,
      url_source: payload.url_source,
      anime_id: payload.anime_id,
      published: payload.published,
    },
  });
  if (!updatedEpisode) throw new InvariantError("Gagal memperbarui episode");
  return updatedEpisode;
};

exports.deleteEpisode = async (episodeId) => {
  const deletedEpisode = await prisma.episodes.delete({
    where: {
      id: episodeId,
    },
  });
  if (!deletedEpisode) throw new InvariantError("Gagal menghapus episode");
  return deletedEpisode;
};

exports.createEpisodeSources = async (payload) => {
  const createdEpisodeSource = await prisma.episode_sources.create({
    data: {
      label: payload.label,
      url_source: payload.url_source,
      scraping_strategy: payload.scraping_strategy,
      anime_id: payload.anime_id,
      episode_id: payload.episode_id,
    },
  });
  if (!createdEpisodeSource) throw new InvariantError("Gagal menambahkan sumber episode");
};
