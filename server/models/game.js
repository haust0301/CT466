const { Schema, model } = require("mongoose");

const GameSchema = Schema({
  title: {
    type: String,
    required: [true, "Tiêu đề là bắt buộc"],
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, "Nội dung là bắt buộc"],
  },
  img: {
    type: String,
  },
  likes: {
    type: Number,
    default: 0
  },
  status: {
    type: Boolean,
    default: true,
  },
  date_added: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Thể loại là bắt buộc"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Người dùng là bắt buộc"],
  },
});

GameSchema.methods.toJSON = function () {
  const { __v, ...game } = this.toObject();
  return game;
};

module.exports = model("Game", GameSchema);
