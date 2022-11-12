const { Router } = require("express");
const { check } = require("express-validator");

const {
  gamesGet,
  gamesGetPopular,
  gamesGetOwned,
  gamesGetLiked,
  gamesGetById,
  gamesPost,
  gamesPut,
  gamesDelete,
  gamesUndelete,
  gamesLike,
  gamesGetRandom,
} = require("../controllers/games");

const { validateJWT, fieldValidation } = require("../middlewares");
const {
  categoryExistsById,
  titleExists,
  gameExistsById,
  isAdminOrOwner,
  checkCanManage,
} = require("../helpers");

const router = Router();

router.get("/", gamesGet);

router.get("/popular", gamesGetPopular);

router.get("/popular", gamesGetRandom);

router.get("/owned", [validateJWT], gamesGetOwned);

router.get("/liked", [validateJWT], gamesGetLiked);

router.get(
  "/:id",
  [
    check("id", "ID không hợp lệ.").isMongoId(),
    fieldValidation,
    check("id").custom(gameExistsById),
    checkCanManage,
    fieldValidation,
  ],
  gamesGetById
);

router.post(
  "/",
  [
    validateJWT,
    check("title", "Bạn chưa nhập tiêu đề.").not().isEmpty(),
    check("title", "Tiêu đề phải từ 2 đến 40 kí tự.").isLength({
      min: 2,
      max: 40,
    }),
    titleExists,
    check("description", "Bạn chưa nhập nội dung mô tả.").not().isEmpty(),
    check(
      "description",
      "Mô tả bài viết phải từ 10 đến 800 kí tự."
    ).isLength({
      min: 10,
      max: 800,
    }),
    check("category", "Thể loại không hợp lệ").isMongoId(),
    fieldValidation,
    check("category").custom(categoryExistsById),
    fieldValidation,
  ],
  gamesPost
);

router.post(
  "/like/:id",
  [
    validateJWT,
    check("id", "ID không hợp lệ.").isMongoId(),
    fieldValidation,
    check("id").custom(gameExistsById),
    fieldValidation,
  ],
  gamesLike
);

router.put(
  "/:id",
  [
    validateJWT,
    isAdminOrOwner,
    check("id", "ID không hợp lệ.").isMongoId(),
    fieldValidation,
    check("id").custom(gameExistsById),
    check("title", "Tiêu đề phải từ 2 đến 40 kí tự..")
      .optional()
      .isLength({
        min: 2,
        max: 40,
      }),
    titleExists,
    check("description", "Mô tả bài viết phải từ 10 đến 800 kí tự.")
      .optional()
      .isLength({
        min: 50,
        max: 800,
      }),
    check("category", "Thể loại không hợp lệ").optional().isMongoId(),
    fieldValidation,
    check("category").optional().custom(categoryExistsById),
    fieldValidation,
  ],
  gamesPut
);

router.delete(
  "/:id",
  [
    validateJWT,
    isAdminOrOwner,
    check("id", "ID không hợp lệ.").isMongoId(),
    fieldValidation,
    check("id").custom(gameExistsById),
    fieldValidation,
  ],
  gamesDelete
);

router.post(
  "/undelete/:id",
  [
    validateJWT,
    isAdminOrOwner,
    check("id", "ID không hợp lệ.").isMongoId(),
    fieldValidation,
    check("id").custom((id) => gameExistsById(id, false)),
    fieldValidation,
  ],
  gamesUndelete
);

module.exports = router;
