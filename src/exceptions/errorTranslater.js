exports.translateErrorToResponse = (error) => {
  switch (error.code) {
    case "P2002":
      return {
        code: 400,
        status: "fail",
        message: `Data untuk ${error.meta.target[0]} harus unique`,
      };
    case "P2000":
      return {
        code: 400,
        status: "fail",
        message: `Kolom data tidak cukup (${error.meta.column_name})`,
      };
    default:
      return {
        code: 500,
        status: "error",
        message: "Terjadi kegagalan pada server kami.",
      };
  }
};
