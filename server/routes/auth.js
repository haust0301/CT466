const { Router } = require("express");
const { check } = require("express-validator");

const { fieldValidation } = require("../middlewares");
const { emailExists } = require("../helpers");

const { register, login, googleSignIn } = require("../controllers/auth");

const router = Router();

router.post(
  "/register",
  [
    check("name", "Bạn chưa nhập tên.").not().isEmpty(),
    check("name", "Tên phải có độ dài từ 2 đến 32 kí tự.").isLength({
      min: 2,
      max: 32,
    }),
    check(
      "password",
      "Mật khẩu phải có ít nhất 8 kí tự và phải bao gồm số và kí tự đặc biệt."
    ).isStrongPassword(),
    check("passwordConfirmation", "Mật khẩu không khớp.").custom(
      (value, { req }) => value === req.body.password
    ),
    check("email", "Email không hợp lệ.").isEmail(),
    check("email").custom(emailExists),
    fieldValidation,
  ],
  register
);

router.post(
  "/login",
  [
    check("email", "Bạn chưa nhập email.").isEmail(),
    check("password", "Bạn chưa nhập mật khẩu.").not().isEmpty(),
    fieldValidation,
  ],
  login
);




module.exports = router;
