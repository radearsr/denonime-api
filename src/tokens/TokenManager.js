require("dotenv").config();
const jwt = require("jsonwebtoken");
const InvariantError = require("../exceptions/InvariantError");

const tokenManager = {
  generateAccessToken: (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: "40s" }),
  generateRefreshToken: (payload) => jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, { expiresIn: "2m" }),
  verifyRefreshToken: (token) => {
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
      return {
        userId: decoded.userId,
        roleId: decoded.roleId,
      };
    } catch (error) {
      if (error.message === "jwt expired") {
        throw new InvariantError("Refresh token expired");
      }
      throw new InvariantError("Token tidak valid");
    }
  },
};

module.exports = tokenManager;
