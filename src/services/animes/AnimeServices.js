const { PrismaClient } = require("@prisma/client");
const slugs = require("slugs");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

const prisma = new PrismaClient();

exports.addNewAnime = async (payload) => {
  const slug = slugs(payload.title);
  const addedAnime = await prisma.animes.create({
    data: {
      title: payload.title,
      description: payload.description,
      poster: payload.poster,
      type: payload.type,
      releaseDate: new Date(payload.releaseDate).toISOString(),
      status: payload.status,
      slug,
      published: payload.published,
    },
  });
  if (!addedAnime.id) throw new InvariantError("Gagal menambahkan anime");
  return {
    animeId: addedAnime.id,
    slug: addedAnime.slug,
  };
};

exports.addAnimeGenres = async (genres, animeId) => {
  const splitedGenre = genres.split(",");
  const matchesGenre = await Promise.all(splitedGenre.map(async (genre) => {
    const result = await prisma.genres.findFirst({
      where: { name: genre.trim() },
    });
    if (result) {
      return { animeId, genreId: result.id };
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
    where: { id: animeId },
  });
  if (!result) throw new NotFoundError("ID anime tidak ditemukan");
};

exports.updateAnime = async (payload, animeId) => {
  const slug = slugs(payload.title);
  const updatedAnime = await prisma.animes.update({
    where: {
      id: animeId,
    },
    data: {
      title: payload.title,
      description: payload.description,
      poster: payload.poster,
      type: payload.type,
      releaseDate: new Date(payload.releaseDate).toDateString(),
      status: payload.status,
      slug,
      published: payload.published,
    },
  });
  if (!updatedAnime.id) throw new InvariantError("Gagal memperbarui anime");
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
      where: { name: genre.trim() },
    });
    if (result) {
      inIdGenres.push(result.id);
      return { animeId, genreId: result.id };
    }
    return "";
  }));

  const filteredMatcheGenre = matchesGenre.filter((genre) => genre !== "");

  const willBeInsert = await Promise.all(filteredMatcheGenre.map(async (genre) => {
    const result = await prisma.anime_genres.findFirst({
      select: { animeId: true, genreId: true },
      where: { animeId: genre.animeId, genreId: genre.genreId },
    });
    if (!result) {
      return { animeId: genre.animeId, genreId: genre.genreId };
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
      where: { genreId: { notIn: inIdGenres }, animeId },
    });
  }
};

exports.deleteAnimeController = async (animeId) => {
  await prisma.anime_genres.deleteMany({
    where: { animeId },
  });
  await prisma.animes.delete({
    where: { id: animeId },
  });
};

exports.readAnimesByTypeWithPagin = async (type, currentPage, pageSize) => {
  const fixType = type.replace(type[0], type[0].toUpperCase());

  if (fixType !== "Series" && fixType !== "Movie") {
    throw new InvariantError(`Maaf data dengan tipe '${fixType}' tidak tersedia, silahkan coba dengan tipe series / movie`);
  }

  const totalAnimes = await prisma.animes.count({
    where: { type: fixType },
  });

  const totalPage = Math.ceil(totalAnimes / parseFloat(pageSize));
  const skipedData = (currentPage * pageSize) - pageSize;
  const results = await prisma.animes.findMany({
    skip: skipedData,
    take: parseFloat(pageSize),
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
      episodes: episodes.episodes,
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

exports.readAnimeWithDetailsEpisode = async (slug, numEpisode = 0) => {
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
        contains: keyword.toLowerCase(),
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
        contains: keyword.toLowerCase(),
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

exports.readAllAnimes = async (status, type) => {
  if ((status !== "ongoing" && status !== "completed") && (type !== "movie" && type !== "series")) {
    throw new InvariantError("Gagal menampilkan data anda harus mencantumkan status (completed / ongoing) dan type (movie / series)");
  }
  const fixStatus = status === "ongoing" ? "Ongoing" : "Completed";
  const fixType = type === "movie" ? "Movie" : "Series";

  const results = await prisma.animes.findMany({
    select: {
      id: true,
      title: true,
      episodes: true,
    },
    where: {
      status: fixStatus,
      type: fixType,
    },
    orderBy: { title: "asc" },
  });
  if (results.length < 1) {
    throw new NotFoundError("Anime tidak ditemukan");
  }
  const remapResult = results.map((result) => ({
    id: result.id,
    title: result.title,
    totalEps: result.episodes.length,
  }));
  return remapResult;
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

exports.readAllAnimeByLastUpdateEps = async (size) => {
  const latestUpdateEps = await prisma.episodes.findMany({
    distinct: ["animeId"],
    select: {
      anime: {
        select: {
          id: true,
          title: true,
          slug: true,
          type: true,
          poster: true,
          rating: true,
          status: true,
          episodes: true,
        },
      },
    },
    take: parseFloat(size),
    skip: 0,
    orderBy: {
      createdAt: "desc",
    },
  });
  const parsingAnimes = latestUpdateEps.map((latest) => ({
    id: latest.anime.id,
    title: latest.anime.title,
    poster: latest.anime.poster,
    slug: latest.anime.slug,
    type: latest.anime.type,
    status: latest.anime.status,
    totalEps: latest.anime.episodes.length,
  }));
  if (latestUpdateEps.length < 1) {
    throw new NotFoundError("Anime dengan episode terbaru tidak ditemukan");
  }
  return parsingAnimes;
};

exports.readAllAnimeByStatusCompleted = async (currentPage, pageSize) => {
  const totalCompletedAnime = await prisma.animes.count({
    where: {
      status: {
        equals: "Completed",
      },
    },
  });

  if (totalCompletedAnime.length < 1) throw new NotFoundError("Anime dengan status completed tidak ditemukan");

  const totalPage = Math.ceil(totalCompletedAnime / parseFloat(pageSize));
  const skipedData = (currentPage * pageSize) - pageSize;

  const completedAnime = await prisma.animes.findMany({
    take: parseFloat(pageSize),
    skip: parseFloat(skipedData),
    select: {
      id: true,
      title: true,
      poster: true,
      slug: true,
      type: true,
      status: true,
      rating: true,
      episodes: true,
    },
    where: {
      status: {
        equals: "Completed",
      },
    },
    orderBy: {
      releaseDate: "desc",
    },
  });
  const mappedCompletedAnimes = completedAnime.map((completed) => ({
    ...completed,
    episodes: completed.episodes.length,
  }));
  return {
    data: mappedCompletedAnimes,
    pages: {
      pageSize: parseFloat(pageSize),
      currentPage: parseFloat(currentPage),
      totalCount: totalCompletedAnime,
      totalPage,
    },
  };
};

exports.readAllAnimeByPopularity = async (currentPage, pageSize) => {
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

  const completedAnime = await prisma.animes.findMany({
    take: parseFloat(pageSize),
    skip: parseFloat(skipedData),
    select: {
      title: true,
      poster: true,
      slug: true,
      type: true,
      status: true,
      rating: true,
      episodes: true,
    },
    where: {
      rating: {
        gt: 0,
      },
    },
    orderBy: {
      rating: "desc",
    },
  });
  const mappedPopulerAnimes = completedAnime.map((populer) => ({
    ...populer,
    episodes: populer.episodes.length,
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
