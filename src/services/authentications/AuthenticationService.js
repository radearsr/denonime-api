const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.addRefreshToken = async (refreshToken) => {
  await prisma.authentication.create({
    data: {
      token: refreshToken,
    },
  });
};
