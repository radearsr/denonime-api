const { PrismaClient } = require("@prisma/client");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const AuthorizationError = require("../../exceptions/AuthorizationError");
const InvariantError = require("../../exceptions/InvariantError");
const tokens = require("../../tokens/TokenManager");

const prisma = new PrismaClient();

exports.addRefreshToken = async (refreshToken) => {
  await prisma.authentications.create({
    data: {
      token: refreshToken,
    },
  });
};

exports.verifyRefreshToken = async (refreshToken) => {
  const availableRefreshToken = await prisma.authentications.findUnique({
    where: { token: refreshToken },
  });

  if (!availableRefreshToken) {
    throw new AuthenticationError("Refresh Token tidak tersedia");
  }
};

exports.deleteRefreshToken = async (refreshToken) => {
  await prisma.authentications.delete({
    where: { token: refreshToken },
  });
};

exports.verifyAuthorization = async (headerWithToken) => {
  try {
    if (!headerWithToken?.startsWith("Bearer ")) throw new AuthenticationError("Oops gagal otentikasi");
    const splitedHeaderWithToken = headerWithToken.split(" ");
    const [, token] = splitedHeaderWithToken;
    const userInfo = tokens.verifyAccessToken(token);
    await prisma.users.findUniqueOrThrow({
      where: { id: userInfo.userId },
    });
    if (userInfo.roleId === "63e978b23148f0aadcd10c29") throw new AuthorizationError("Anda tidak berhak untuk mengkses sumber ini");
    return userInfo;
  } catch (error) {
    throw new InvariantError(error.message);
  }
};
