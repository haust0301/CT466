const validateFile = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    return res.status(400).json({ msg: "Không có file được đăng tải" });
  }
  if (
    req.files.file.mimetype != "image/jpeg" &&
    req.files.file.mimetype != "image/png"
  ) {
    return res
      .status(400)
      .json({ msg: "Định dạng file không hợp lệ. File phải thuộc các kiểu định dạng JPG, JPEG, PNG." });
  }
  if (req.files.file.size > 1500000) {
    return res.status(400).json({ msg: "Kích thước file lớn, vượt quá 1.5MB." });
  }
  next();
};

module.exports = {
  validateFile,
};
