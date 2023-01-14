const { PrismaClient } = require("@prisma/client");
const InvariantError = require("../../exceptions/InvariantError");

const prisma = new PrismaClient();

exports.addRefreshToken = async (refreshToken) => {
  const addedToken = await prisma.authentication.create({
    data: {
      token: refreshToken,
    },
  });

  if (!addedToken.token) {
    throw new InvariantError("Gagal menambahkan refresh token ke database");
  }
};
