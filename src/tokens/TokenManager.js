require("dotenv").config();
const jwt = require("jsonwebtoken");

const tokenManager = {
  generateAccessToken: (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: "40s" }),
  generateRefreshToken: (payload) => jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, { expiresIn: "2m" }),
  verifyRefreshToken: (token) => jwt.verify(
    token,
    process.env.REFRESH_TOKEN_KEY,
    (error, decoded) => (
      new Promise((resolve, reject) => {
        if (error) {
          reject(error);
        }
        resolve(decoded);
      })
    ),
  ),
  verifyAccessToken: (token) => jwt.verify(
    token,
    process.env.ACCESS_TOKEN_KEY,
    (error, decoded) => (
      new Promise((resolve, reject) => {
        if (error) {
          reject(error);
        }
        resolve(decoded);
      })
    ),
  ),
};

module.exports = tokenManager;
