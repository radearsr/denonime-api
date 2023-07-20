const services = require("../../../services/v2/animes/animeServices");
const validator = require("../../../validators/v2/animes");

exports.postAnimeController = async (req, res, next) => {
  try {
    validator.validateAnime(req.body);
    const createdAnime = await services.createAnime({
      ...req.body,
      title: req.body.title.trim(),
    });
    await services.createAnimeGenres(
      req.body.genres,
      createdAnime.id,
    );
    res.statusCode = 201;
    res.send({
      status: "success",
      message: "Berhasil menambahkan anime baru",
      data: {
        id: createdAnime.id,
        title: createdAnime.title,
        anime_slug: createdAnime.anime_slug,
      },
    });
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

exports.putAnimeController = async (req, res, next) => {
  try {
    const { animeId } = req.params;
    await services.verifyAnimeId(parseInt(animeId));
    validator.validateAnime(req.body);
    const updatedAnime = await services.updateAnimeById(parseInt(animeId), req.body);
    res.send({
      status: "success",
      message: `Berhasil memperbarui anime ${updatedAnime.title}`,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAnimeController = async (req, res, next) => {
  try {
    const { animeId } = req.params;
    await services.verifyAnimeId(parseInt(animeId));
    const deletedAnime = await services.deleteAllDataWithRelatedAnimeId(parseInt(animeId));
    res.send({
      status: "success",
      message: `Berhasil menghapus anime ${deletedAnime.title}`,
    });
  } catch (error) {
    next(error);
  }
};

exports.postAnimeSourcesController = async (req, res, next) => {
  try {
    validator.validateAnimeDetailSources(req.body);
    await services.verifyAnimeId(req.body.anime_id);
    await services.createAnimeDetailSources(req.body);
    res.send({
      status: "success",
      message: "Berhasil menambahkan sumber anime",
    });
  } catch (error) {
    next(error);
  }
};

exports.getCountAnimesController = async (req, res, next) => {
  try {
    validator.validateGetAnimeCount(req.query);
    const animesCount = await services.readAnimesCount(req.query.scraping_strategy);
    res.send({
      status: "success",
      animes_count: animesCount,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllAnimesWithoutFilterController = async (req, res, next) => {
  try {
    const animes = await services.readAllAnimesWithoutFilter();
    res.send({
      status: "success",
      message: "Berhasil mendapatkan semua anime",
      data: animes,
    });
  } catch (error) {
    next(next);
  }
};

exports.getAllAnimesOngoing = async (req, res, next) => {
  try {
    const animes = await services.readOngoingAnimes();
    res.send({
      status: "success",
      message: "Berhasil mendapatkan anime ongoing",
      data: animes,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAnimesWithSortingController = async (req, res, next) => {
  try {
    const {
      status = "*",
      type = "*",
      order_by: orderBy = "title",
      sorting = "asc",
      current_page: currentPage = 0,
      page_size: pageSize = 10,
    } = req.query;
    const animes = await services.readAnimesWithSorting({
      status,
      type,
      order_by: orderBy,
      sorting,
      current_page: parseInt(currentPage),
      page_size: parseInt(pageSize),
    });
    res.send({
      status: "success",
      message: "Berhasil mendapatkan anime",
      data: animes.data,
      pages: animes.pages,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAnimeGenresController = async (req, res, next) => {
  try {
    const genres = await services.readAnimeGenres();
    res.send({
      status: "success",
      message: "Berhasil menampilkan semua genre",
      data: genres,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAnimeByIdController = async (req, res, next) => {
  try {
    const { animeId } = req.params;
    const anime = await services.readAnimeById(parseInt(animeId));
    res.send({
      status: "success",
      message: `Berhasil mendapatkan anime dengan id ${animeId}`,
      data: anime,
    });
  } catch (error) {
    next(error);
  }
};
