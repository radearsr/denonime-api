const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");
const AuthenticationError = require("../../exceptions/AuthenticationError");

const prisma = new PrismaClient();

exports.verifyNewUsername = async (username) => {
  const availableUsername = await prisma.users.findFirst({
    where: { username },
  });
  if (availableUsername?.username === username) {
    throw new InvariantError("Gagal menambahkan user baru, username sudah digunakan");
  }
};

exports.addUser = async (payload) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const addedUser = await prisma.users.create({
    data: {
      firstName: payload.first_name,
      lastName: payload.last_name,
      username: payload.username,
      password: hashedPassword,
      roleId: "63e96eeea365e6229adf5e4e",
      email: payload.email,
      createdAt: new Date().toISOString(),
    },
  });
  const roles = await prisma.roles.findUnique({
    where: { id: "63e96eeea365e6229adf5e4e" },
  });
  if (addedUser.id < 1) {
    throw new InvariantError("User gagal ditambahkan");
  }
  return {
    userId: addedUser.id,
    username: addedUser.username,
    role: roles.name,
  };
};

exports.verifyAvailableUser = async (username) => {
  const availableUser = await prisma.users.findFirst({
    where: { username },
  });
  if (availableUser === null) {
    throw new AuthenticationError("Username tidak tersedia, silahkan registrasi terlebih dahulu");
  }
};

exports.verifyUserCredential = async (username, password) => {
  const availableUsername = await prisma.users.findFirst({
    where: { username },
  });
  if (!availableUsername) {
    throw new AuthenticationError("Username tidak tersedia, mohon untuk registrasi terlebih dahulu");
  }
  const { password: encodedPassword } = availableUsername;
  const match = bcrypt.compare(password, encodedPassword);

  if (!match) {
    throw new AuthenticationError("Password yang anda masukkan salah");
  }

  return {
    userId: availableUsername.id,
    roleId: availableUsername.roleId,
  };
};
