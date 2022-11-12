const bcryptjs = require("bcryptjs");
const { generateJWT, googleVerify } = require("../helpers");
const User = require("../models/user");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({
    name,
    email,
    password,
    role: "user",
  });

  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  await user.save();
  
  const token = await generateJWT(user.id);

  res.json({
    user,
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        msg: "Email này không thể đăng kí.",
      });
    }

    if (!user.status) {
      return res.status(400).json({
        msg: "Người dùng đã bị xoá.",
      });
    }

    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        msg: "Mật khẩu không hợp lệ.",
      });
    }

    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Đã có lỗi xảy ra!",
      error,
    });
  }
};

const googleSignIn = async (req, res) => {
  const { id_token } = req.body;
  try {
    const { name, email } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    if (!user) {
      const userData = {
        name,
        email,
        password: "Google",
        google: true,
        role: "user",
      };
      user = new User(userData);
      await user.save();
    }

    if (!user.status) {
      return res.status(401).json({
        msg: "Người dùng đã bị xoá.",
      });
    }

    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    return res.status(400).json({
      msg: "Không thể xác thực",
    });
  }
};

module.exports = {
  register,
  login,
  googleSignIn
};
