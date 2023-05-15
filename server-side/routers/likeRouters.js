const router = require("express").Router();
const { likeControllers } = require("../controllers");
const authorize = require("../middleware/authorize");

router.post("/liked/:id", authorize.login, likeControllers.likePost);

module.exports = router;
