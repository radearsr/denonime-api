const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");

const prisma = new PrismaClient();

exports.verifyAvailableUsername = async (username) => {
  const availableUsername = await prisma.user.findMany({
    where: { username },
  });
  if (availableUsername.length >= 1) {
    throw new InvariantError("Gagal menambahkan user baru, username sudah digunakan");
  }
};

exports.addUser = async (payload) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const addedUser = await prisma.user.create({
    data: {
      firstName: payload.first_name,
      lastName: payload.last_name,
      username: payload.username,
      password: hashedPassword,
      roleId: 2,
      email: payload.email,
    },
  });
  const role = await prisma.role.findUnique({
    where: { id_roles: 2 },
  });
  console.log();
  if (addedUser.id < 1) {
    throw new InvariantError("User gagal ditambahkan");
  }
  return {
    userId: addedUser.id,
    username: addedUser.username,
    role: role.role_name,
  };
};
