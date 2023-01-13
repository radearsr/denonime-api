const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const AuthenticationError = require("../../exceptions/AuthenticationError");

const prisma = new PrismaClient();

exports.verifyAvailableUser = async (username) => {
  const availableUser = await prisma.user.findFirst({
    where: { username },
  });
  if (availableUser === null) {
    throw new AuthenticationError("Username tidak tersedia, silahkan registrasi terlebih dahulu");
  }
};

exports.verifyUserCredential = async (username, password) => {
  const availableUsername = await prisma.user.findFirst({
    where: { username },
  });
  if (!availableUsername) {
    throw new AuthenticationError("Username tidak tersedia, mohon untuk registrasi terlebih dahulu");
  }
  const { password: encodedPassword } = availableUsername;
  const match = await bcrypt.compare(password, encodedPassword);
  if (!match) {
    throw new AuthenticationError("Password yang anda masukkan salah");
  }
};
