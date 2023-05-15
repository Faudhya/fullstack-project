const router = require("express").Router();
const { likeControllers } = require("../controllers");
const authorize = require("../middleware/authorize");

router.post("/liked/:id", authorize.login, likeControllers.likePost);
router.delete("/unlike/:id", authorize.login, likeControllers.unlike);

module.exports = router;
