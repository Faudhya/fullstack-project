const db = require("../models");
const profile = db.Profile;
const multer = require("multer");
const path = require("path");

//setup multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            path.parse(file.originalname).name +
                "-" +
                Date.now() +
                path.extname(file.originalname)
        );
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(
                new Error("Invalid file type. Only PNG, JPG, and JPEG allowed.")
            );
        }
    },
}).single("profile_picture");

module.exports = {
    createProfile: async (req, res) => {
        try {
            // upload image menggunakan multer
            upload(req, res, async (err) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({
                        message: "Error uploading image",
                    });
                }

                const { full_name, bio } = req.body;

                const result = await profile.create({
                    profile_picture: req.file.filename,
                    full_name: full_name,
                    bio: bio,
                    user_id: req.userId,
                });

                res.status(200).json({
                    message: "Profile created successfully",
                    result,
                });
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Error creating profile",
            });
        }
    },
    updateProfile: async (req, res) => {
        try {
            await profile.update(req.body, {
                where: { user_id: req.userId },
            });
            res.status(200).send({
                status: true,
                message: "your profile has been updated",
            });
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    },
};
