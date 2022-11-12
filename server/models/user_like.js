const { Schema, model } = require("mongoose");

const UserLikeSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Người dùng là bắt buộc"],
  },
  game: {
    type: Schema.Types.ObjectId,
    ref: "Game",
    required: [true, "Bài viết là bắt buộc"],
  },
  date_liked: {
    type: Date,
    default: Date.now,
  },
});

UserLikeSchema.methods.toJSON = function () {
  const { __v, ...userLike } = this.toObject();
  return userLike;
};

module.exports = model("UserLike", UserLikeSchema);
