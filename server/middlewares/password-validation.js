const matchingPasswords = (req, res, next) => {
  if (req.body.password != req.body.confirmPassword) {
    return res.status(400).json({
      msg: "Mật khẩu không khớp.",
    });
  }
  next();
};

module.exports = {
  matchingPasswords,
};
