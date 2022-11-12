const jwt = require("jsonwebtoken");

const generateJWT = (id = "") => {
  return new Promise((resolve, reject) => {
    const payload = { id };
    jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      },
      (err, token) => {
        if (err) {
          console.log("JWT lỗi", err);
          reject("Không thể phát token.");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generateJWT,
};
