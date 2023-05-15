const router = require("express").Router();
const { postControllers } = require("../controllers");
const authorize = require("../middleware/authorize");

router.get("/fetch", authorize.login, postControllers.fetchPosts);
router.post("/create", authorize.login, postControllers.createPost);

module.exports = router;
