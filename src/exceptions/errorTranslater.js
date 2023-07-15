exports.translateErrorToResponse = (error) => {
  switch (error.code) {
    case "P2002":
      return {
        code: 400,
        status: "fail",
        message: `Data untuk ${error.meta.target[0]} harus unique`,
      };
    default:
      return {
        code: 500,
        status: "error",
        message: "Terjadi kegagalan pada server kami.",
      };
  }
};
