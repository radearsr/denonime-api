const { PrismaClient } = require("@prisma/client");
const slugs = require("slugs");
const InvariantError = require("../../../exceptions/InvariantError");

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
      last_episode_update: payload.last_episode_update,
      published: payload.published,
    },
  });
  if (!createdAnime.id) throw new InvariantError("Gagal menambahkan anime");
  return {
    anime_id: createdAnime.id,
    anime_slug: createdAnime.anime_slug,
  };
};
