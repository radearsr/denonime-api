const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const AuthenticationError = require("../../exceptions/AuthenticationError");

const prisma = new PrismaClient();
