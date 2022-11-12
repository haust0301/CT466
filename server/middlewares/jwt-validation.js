const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validateJWT = async (req, res, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      msg: "Yêu cầu không chứa mã token.",
    });
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({
        msg: "Người dùng không tồn tại.",
      });
    }

    if (!user.status) {
      return res.status(401).json({
        msg: "Người dùng đã bị xoá.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      msg: "Token không hợp lệ.",
    });
  }
};

module.exports = {
  validateJWT,
};
