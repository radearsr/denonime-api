const { PrismaClient } = require("@prisma/client");
const AuthenticationError = require("../../exceptions/AuthenticationError");

const prisma = new PrismaClient();

exports.addRefreshToken = async (refreshToken) => {
  await prisma.authentication.create({
    data: {
      token: refreshToken,
    },
  });
};

exports.verifyRefreshToken = async (refreshToken) => {
  const availableRefreshToken = await prisma.authentication.findUnique({
    where: { token: refreshToken },
  });

  if (!availableRefreshToken) {
    throw new AuthenticationError("Refresh Token tidak tersedia");
  }
};

exports.deleteRefreshToken = async (refreshToken) => {
  await prisma.authentication.delete({
    where: { token: refreshToken },
  });
};
