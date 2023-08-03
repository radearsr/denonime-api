const { PrismaClient } = require("@prisma/client");
const slugs = require("slugs");
const InvariantError = require("../../../exceptions/InvariantError");
const NotFoundError = require("../../../exceptions/NotFoundError");
const utils = require("../../../utils");

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

exports.deleteAllDataWithRelatedAnimeId = async (animeId) => {
  const deletedAnimeAndGenres = await prisma.$transaction([
    prisma.episode_sources.deleteMany({
      where: {
        anime_id: animeId,
      },
    }),
    prisma.episodes.deleteMany({
      where: {
        anime_id: animeId,
      },
    }),
    prisma.anime_detail_sources.deleteMany({
      where: {
        anime_id: animeId,
      },
    }),
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
  return deletedAnimeAndGenres[4];
};

exports.createAnimeDetailSources = async (payload) => {
  const createdDetail = await prisma.anime_detail_sources.create({
    data: {
      anime_id: payload.anime_id,
      url_source: payload.url_source,
      scraping_strategy: payload.scraping_strategy,
      monitoring: payload.monitoring,
    },
  });
  if (!createdDetail) throw new InvariantError("Gagal membuat anime detail sources");
};

exports.readAnimesCount = async (scrapingStrategy) => {
  const animesCount = await prisma.animes.count({
    where: {
      anime_detail_sources: {
        some: {
          scraping_strategy: scrapingStrategy,
        },
      },
    },
  });
  if (animesCount === null) {
    throw new InvariantError(`Gagal menghitung anime dengan scraping strategy ${scrapingStrategy}`);
  }
  return animesCount;
};

exports.readAllAnimesWithoutFilter = async () => {
  const animes = await prisma.animes.findMany();
  return animes;
};

exports.readOngoingAnimes = async () => {
  const animes = await prisma.animes.findMany({
    select: {
      id: true,
      title: true,
      anime_detail_sources: {
        select: {
          url_source: true,
          scraping_strategy: true,
        },
        where: {
          monitoring: true,
        },
      },
      episodes: {
        select: {
          number_episode: true,
        },
      },
    },
    where: {
      status: "ONGOING",
    },
  });
  return animes;
};

exports.readAnimesWithSorting = async (queryParams) => {
  const orderBy = utils.createOrderBy(queryParams.order_by, queryParams.sorting);
  const whereQuery = utils.createWhereQuery(queryParams.status, queryParams.type);
  const animesCount = await prisma.animes.count({
    where: whereQuery,
  });
  if (!animesCount) throw new NotFoundError(`anime dengan status ${queryParams} dan type ${queryParams.type}`);

  const totalPage = Math.ceil(animesCount / queryParams.page_size);
  const skipedData = (queryParams.current_page * queryParams.page_size) - queryParams.page_size;

  const animes = await prisma.animes.findMany({
    include: {
      anime_genres: {
        select: {
          genre: true,
        },
      },
      _count: {
        select: {
          episodes: true,
        },
      },
    },
    where: whereQuery,
    take: queryParams.page_size,
    skip: skipedData,
    orderBy,
  });

  if (!animes) throw new InvariantError("Gagal mendapatkan anime yang dimaksud");
  const newAnimeFormated = animes.map((anime) => {
    const genres = anime.anime_genres.map((animeGenre) => (animeGenre.genre.name));
    return {
      ...anime,
      anime_genres: genres,
    };
  });
  return {
    data: newAnimeFormated,
    pages: {
      current_page: queryParams.current_page,
      total_page: totalPage,
    },
  };
};

exports.readAnimeGenres = async () => {
  const genres = await prisma.genres.findMany();

  if (!genres) throw new NotFoundError("Genre tidak ditemukan");

  return genres;
};

exports.readAnimeById = async (animeId) => {
  if (!animeId) throw new InvariantError("ID anime tidak sesuai");
  const anime = await prisma.animes.findUnique({
    where: {
      id: animeId,
    },
  });
  if (!anime) throw new NotFoundError(`anime dengan ID ${animeId} tidak ditemukan`);
  return anime;
};

exports.readAnimeBySlug = async (animeSlug) => {
  const anime = await prisma.animes.findFirst({
    where: {
      anime_slug: animeSlug,
    },
  });

  if (!anime) throw new NotFoundError(`anime dengan slug ${animeSlug} tidak ditemukan`);

  return anime;
};

exports.readAnimesBySearch = async (queryParams) => {
  const animesCount = await prisma.animes.count({
    where: {
      title: {
        contains: queryParams.keyword,
        mode: "insensitive",
      },
    },
  });

  if (!queryParams.current_page || !queryParams.page_size) throw new InvariantError("Maaf permintaan anda tidak sesuai");
  if (!animesCount) throw new NotFoundError(`Anime dengan judul ${queryParams.keyword} tidak ditemukan`);

  const totalPage = Math.ceil(animesCount / queryParams.page_size);
  const skipedData = (queryParams.current_page * queryParams.page_size) - queryParams.page_size;

  const animes = await prisma.animes.findMany({
    include: {
      anime_genres: {
        select: {
          genre: true,
        },
      },
      _count: {
        select: {
          episodes: true,
        },
      },
    },
    where: {
      title: {
        contains: queryParams.keyword,
        mode: "insensitive",
      },
    },
    take: queryParams.page_size,
    skip: skipedData,
    orderBy: {
      title: "asc",
    },
  });

  return {
    data: animes,
    pages: {
      current_page: queryParams.current_page,
      total_page: totalPage,
    },
  };
};

exports.readAnimesByGenreName = async (genreSlug, queryParams) => {
  const orderBy = utils.createOrderBy(queryParams.order_by, queryParams.sorting);
  const whereQuery = utils.createWhereQuery(queryParams.status, queryParams.type);

  const genre = await prisma.genres.findFirst({
    select: {
      id: true,
    },
    where: {
      genre_slug: {
        equals: genreSlug,
      },
    },
  });

  if (!genre) throw new NotFoundError(`Genre ${genreSlug} tidak ditemukan`);

  const animeIds = await prisma.anime_genres.findMany({
    select: {
      anime_id: true,
    },
    where: {
      genre_id: genre.id,
    },
  });

  const animeIdArrays = animeIds.map((anime) => anime.anime_id);

  const totalAnimes = await prisma.animes.count({
    where: {
      ...whereQuery,
      id: {
        in: animeIdArrays,
      },
    },
  });

  const totalPage = Math.ceil(totalAnimes / queryParams.page_size);
  const skipedData = (queryParams.current_page * queryParams.page_size) - queryParams.page_size;

  const animes = await prisma.animes.findMany({
    include: {
      anime_genres: {
        select: {
          genre: true,
        },
      },
      _count: {
        select: {
          episodes: true,
        },
      },
    },
    where: {
      ...whereQuery,
      id: {
        in: animeIdArrays,
      },
    },
    take: queryParams.page_size,
    skip: skipedData,
    orderBy,
  });

  return {
    data: animes,
    pages: {
      current_page: queryParams.current_page,
      total_page: totalPage,
    },
  };
};
