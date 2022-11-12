const hasRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: "Không thể xác thực với vai trò người dùng này!",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        msg: `Đủ đặc quyền.`,
      });
    }
    next();
  };
};

module.exports = {
  hasRole,
};
