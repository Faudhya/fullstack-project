const router = require("express").Router();
const { profileControllers } = require("../controllers");
const authorize = require("../middleware/authorize");

router.post("/create", authorize.login, profileControllers.createProfile);
router.patch("/update", authorize.login, profileControllers.updateProfile);

module.exports = router;
