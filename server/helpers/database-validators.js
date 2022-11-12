const User = require("../models/user");
const Category = require("../models/category");
const Game = require("../models/game");

const emailExists = async (email = "") => {
  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error(`Email đã tồn tại.`);
  }
};

const titleExists = async (req, res, next) => {
  const { title } = req.body;
  const exists = await Game.findOne({ title });
  if (exists && req.params.id) {
    const game = await Game.findById(req.params.id);
    if (game.title !== title.toLowerCase()) {
      return res.status(400).json({ msg: "Tiêu đề bài viết đã tồn tại." });
    }
  }

  if (exists && !req.params.id) {
    return res.status(400).json({ msg: "Tiêu đề bài viết đã tồn tại." });
  }

  next();
};

const userExistsById = async (id = "") => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error(`Người dùng với ID: ${id} đã tồn tại.`);
  }
  if (!user.status) {
    throw new Error("Người dùng đã bị xoá.");
  }
};

const categoryExistsById = async (id = "") => {
  const category = await Category.findById(id);
  if (!category) {
    throw new Error(`Thể loại ${id} không tồn tại.`);
  }
};

const gameExistsById = async (id = "", mustExist = true) => {
  const game = await Game.findById(id);
  if (!game) {
    throw new Error(`Bài viết ${id} không tồn tại.`);
  }

  if (!game.status && mustExist) {
    throw new Error(`Bài viết ${id} đã bị xoá.`);
  }

  if (game.status && !mustExist) {
    throw new Error(`Bài viết ${id} không bị xoá.`);
  }
};

const isOwner = async (req, res, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: "Không thể xác nhận vai trò nếu token không được xác nhận.",
    });
  }
  const game = await Game.findById(req.params.id).populate("user");
  if (game.user.id !== req.user.id) {
    return res.status(400).json({
      msg: "Bạn là người đăng tải bài viết này.",
    });
  }
  next();
};

const isAdminOrOwner = async (req, res, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: "Không thể xác nhận vai trò nếu token không được xác nhận.",
    });
  }

  const game = await Game.findById(req.params.id).populate("user");

  roles = ["admin"];
  if (game.user.id !== req.user.id && !roles.includes(req.user.role)) {
    return res.status(401).json({
      msg: `Đủ đặc quyền.`,
    });
  }
  next();
};

const allowedCollections = (collection = "", collections = []) => {
  const included = collections.includes(collection);
  if (!included) {
    throw new Error(
      `Bộ sưu tập: ${collection} không cho phép - Chỉ ${collections}`
    );
  }
  return true;
};

module.exports = {
  emailExists,
  titleExists,
  userExistsById,
  categoryExistsById,
  gameExistsById,
  isOwner,
  isAdminOrOwner,
  allowedCollections,
};
