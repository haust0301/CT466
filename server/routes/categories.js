const { Router } = require("express");
const { categoriesGet, categoryPost } = require("../controllers/categories");

const router = Router();

router.get("/", categoriesGet);
router.post("/",categoryPost);

module.exports = router;