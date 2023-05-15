const router = require("express").Router();
const { postControllers } = require("../controllers");
const authorize = require("../middleware/authorize");

router.get("/fetch", authorize.login, postControllers.fetchPosts);
router.get("/fetch/:id", authorize.login, postControllers.postDetails);
router.delete("/delete/:id", authorize.login, postControllers.deletePost);
router.patch("/update/:id", authorize.login, postControllers.updatePost);
router.post("/create", authorize.login, postControllers.createPost);

module.exports = router;
