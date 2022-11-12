const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, "Tên là bắt buộc"],
  },
  email: {
    type: String,
    required: [true, "Email là bắt buộc"],
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password là bắt buộc"],
  },
  google: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    required: [true, "Vai trò là bắt buộc"],
    enum: ["admin", "user"],
  },
});

UserSchema.methods.toJSON = function () {
  const { __v, password, ...user } = this.toObject();
  return user;
};

module.exports = model("User", UserSchema);
