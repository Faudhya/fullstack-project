const router = require("express").Router();
const { commentControllers } = require("../controllers");
const authorize = require("../middleware/authorize");

router.get(
    "/fetch/:id",
    authorize.login,
    commentControllers.fetchCommentsFromPost
);
router.post("/commented/:id", authorize.login, commentControllers.commentPost);

module.exports = router;
