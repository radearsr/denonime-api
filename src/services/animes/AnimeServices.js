const { PrismaClient } = require("@prisma/client");
const slugs = require("slugs");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

const prisma = new PrismaClient();

exports.addNewAnime = async (payload) => {
  const slug = slugs(payload.title);
  const publish = payload.publish ? "Publish" : "NonPublish";
  const addedAnime = await prisma.animes.create({
    data: {
      title: payload.title,
      rating: payload.rating,
      originalSource: payload.originalSource,
      description: payload.description,
      poster: payload.poster,
      type: payload.type,
      releaseDate: new Date(payload.releaseDate),
      status: payload.status,
      slug,
      publish,
    },
  });
  if (!addedAnime.animeId) throw new InvariantError("Gagal menambahkan anime");
  return {
    animeId: addedAnime.animeId,
    slug: addedAnime.slug,
  };
};

exports.addAnimeGenres = async (genres, animeId) => {
  const splitedGenre = genres.split(",");
  const matchesGenre = await Promise.all(splitedGenre.map(async (genre) => {
    const result = await prisma.genres.findFirst({
      where: {
        name: {
          contains: genre.toLowerCase().trim(),
          mode: "insensitive",
        },
      },
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
      rating: payload.rating,
      originalSource: payload.originalSource,
      description: payload.description,
      poster: payload.poster,
      type: payload.type,
      releaseDate: new Date(payload.releaseDate),
      status: payload.status,
      slug,
      published: payload.published,
    },
  });
  if (!updatedAnime.animeId) throw new InvariantError("Gagal memperbarui anime");
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
      where: {
        name: {
          contains: genre.toLowerCase().trim(),
          mode: "insensitive",
        },
      },
    });
    if (result) {
      inIdGenres.push(result.genreId);
      return { animeId, genreId: result.genreId };
    }
    return "";
  }));

  const filteredMatcheGenre = matchesGenre.filter((genre) => genre !== "");

  const willBeInsert = await Promise.all(filteredMatcheGenre.map(async (genre) => {
    const result = await prisma.anime_genres.findFirst({
      select: { animeId: true, genreId: true },
      where: { animeId: parseFloat(genre.animeId), genreId: genre.genreId },
    });
    if (!result) {
      return { animeId: parseFloat(genre.animeId), genreId: genre.genreId };
    }
    return "";
  }));

  const filteredWillBeInsert = willBeInsert.filter((willInsert) => willInsert !== "");

  if (filteredWillBeInsert.length >= 1) {
    await prisma.anime_genres.createMany({
      data: filteredWillBeInsert,
    });
  }

  if (inIdGenres.length >= 1) {
    await prisma.anime_genres.deleteMany({
      where: { genreId: { notIn: inIdGenres }, animeId: parseFloat(animeId) },
    });
  }
};

exports.deleteAnimeController = async (animeId) => {
  await prisma.anime_genres.deleteMany({
    where: { animeId: parseFloat(animeId) },
  });
  await prisma.animes.delete({
    where: { animeId: parseFloat(animeId) },
  });
};

exports.readAnimesByTypeWithPagin = async (type, currentPage, pageSize) => {
  console.log({ type, currentPage, pageSize });
  const fixType = type.replace(type[0], type[0].toUpperCase());
  if (fixType !== "Series" && fixType !== "Movie") {
    throw new InvariantError(`Maaf data dengan tipe '${fixType}' tidak tersedia, silahkan coba dengan tipe series / movie`);
  }

  const totalAnimes = await prisma.animes.count({
    where: { type: fixType },
  });

  const totalPage = Math.ceil(totalAnimes / pageSize);
  const skipedData = (currentPage * pageSize) - pageSize;
  const results = await prisma.animes.findMany({
    skip: skipedData,
    take: pageSize,
    where: {
      type: fixType,
    },
    include: {
      _count: {
        select: {
          episodes: true,
        },
      },
      anime_genres: {
        select: {
          genre: true,
        },
      },
    },
    orderBy: {
      title: "asc",
    },
  });

  const remapResult = results.map(({ _count: episodes, ...result }) => {
    const mappedGenres = result.anime_genres.map((animeGenre) => animeGenre.genre.name);
    return {
      ...result,
      totalEps: episodes.episodes,
      anime_genres: mappedGenres,
    };
  });

  return {
    pages: {
      pageSize: parseFloat(pageSize),
      currentPage: parseFloat(currentPage),
      totalCount: totalAnimes,
      totalPage,
    },
    data: {
      remapResult,
    },
  };
};

exports.readAnimeWithDetailsEpisode = async (slug, numEpisode) => {
  const animesWithEpisode = await prisma.animes.findFirst({
    where: { slug },
    include: {
      episodes: {
        where: { numEpisode },
      },
    },
  });
  if (!animesWithEpisode) throw new NotFoundError(`Gagal mendapatkan detail anime dengan identitas '${slug}'`);
  if (animesWithEpisode.episodes.length < 1) throw new NotFoundError(`Episode ${numEpisode} pada anime '${animesWithEpisode.title}' tidak ditemukan`);
  return animesWithEpisode;
};

exports.readAnimeById = async (animeId) => {
  const anime = await prisma.animes.findUnique({
    where: { animeId },
  });
  return anime;
};

exports.readAnimesBySearchTitle = async (keyword, currentPage, pageSize) => {
  const totalAnimes = await prisma.animes.count({
    where: {
      title: {
        contains: keyword,
        mode: "insensitive",
      },
    },
  });

  if (totalAnimes.length < 1) throw new NotFoundError(`Anime dengan kata kunci '${keyword}' tidak ditemukan`);

  const totalPage = Math.ceil(totalAnimes / parseFloat(pageSize));
  const skipedData = (currentPage * pageSize) - pageSize;

  const results = await prisma.animes.findMany({
    skip: skipedData,
    take: pageSize,
    where: {
      title: {
        contains: keyword,
        mode: "insensitive",
      },
    },
    include: {
      _count: {
        select: {
          episodes: true,
        },
      },
      anime_genres: {
        select: {
          genre: true,
        },
      },
    },
    orderBy: {
      title: "asc",
    },
  });

  const remapResult = results.map(({ _count: episodes, ...result }) => {
    const mappedGenres = result.anime_genres.map((animeGenre) => animeGenre.genre.name);
    return {
      ...result,
      ...episodes,
      anime_genres: mappedGenres,
    };
  });

  return {
    data: remapResult,
    pages: {
      pageSize: parseFloat(pageSize),
      currentPage: parseFloat(currentPage),
      totalCount: totalAnimes,
      totalPage,
    },
  };
};

exports.readAllAnimes = async () => {
  const results = await prisma.animes.findMany({
    orderBy: { title: "asc" },
  });
  if (results.length < 1) {
    throw new NotFoundError("Anime tidak ditemukan");
  }
  return results;
};

exports.readAllAnimeGenres = async () => {
  const genres = await prisma.genres.findMany({
    orderBy: { name: "asc" },
  });
  if (genres.length < 1) {
    throw new NotFoundError("Genre tidak ditemukan");
  }
  return genres;
};

exports.readAllAnimesLatest = async (size) => {
  const animeLatestUpdateEpisode = await prisma.animes.findMany({
    take: size,
    skip: 0,
    include: {
      _count: true,
    },
    orderBy: {
      lastUpdateEpisode: "desc",
    },
  });
  const parsingAnimes = animeLatestUpdateEpisode.map((latest) => ({
    animeId: latest.animeId,
    rating: latest.rating,
    title: latest.title,
    poster: latest.poster,
    slug: latest.slug,
    type: latest.type,
    status: latest.status,
    totalEps: latest._count.episodes,
  }));
  if (parsingAnimes.length < 1) {
    throw new NotFoundError("Anime dengan episode terbaru tidak ditemukan");
  }
  return parsingAnimes;
};

exports.readAllAnimesPopular = async (currentPage, pageSize) => {
  const totalPopuler = await prisma.animes.count({
    where: {
      rating: {
        gt: 0,
      },
    },
  });

  if (totalPopuler.length < 1) throw new NotFoundError("Anime dengan rating lebih dari 0 tidak ditemukan");

  const totalPage = Math.ceil(totalPopuler / parseFloat(pageSize));
  const skipedData = (currentPage * pageSize) - pageSize;

  const popularAnime = await prisma.animes.findMany({
    take: parseFloat(pageSize),
    skip: parseFloat(skipedData),
    where: {
      rating: {
        gt: 0,
      },
      status: "Completed",
    },
    include: {
      _count: true,
    },
    orderBy: {
      rating: "desc",
    },
  });
  const mappedPopulerAnimes = popularAnime.map((populer) => ({
    ...populer,
    totalEps: populer._count.episodes,
  }));
  return {
    data: mappedPopulerAnimes,
    pages: {
      pageSize: parseFloat(pageSize),
      currentPage: parseFloat(currentPage),
      totalCount: totalPopuler,
      totalPage,
    },
  };
};
