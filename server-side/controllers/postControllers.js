const db = require("../models");
const post = db.Post;
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
}).single("image");

module.exports = {
    createPost: async (req, res) => {
        try {
            // upload image menggunakan multer
            upload(req, res, async (err) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({
                        message: "Error uploading image",
                    });
                }

                const { caption } = req.body;

                const newPost = await post.create({
                    image: req.file.filename,
                    caption: caption,
                    user_id: req.userId,
                });

                res.status(200).json({
                    message: "Post created successfully",
                    post: newPost,
                });
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Error creating post",
            });
        }
    },
    fetchPosts: async (req, res) => {
        try {
            const query = `SELECT posts.id, users.username, posts.image, posts.caption, posts.createdAt AS created_date, COUNT(likes.id) as likes
            FROM posts
            JOIN users ON posts.user_id = users.id
            LEFT JOIN likes ON posts.id = likes.post_id
            WHERE posts.is_active = 1
            GROUP BY posts.id;
            `;
            const [results] = await db.sequelize.query(query);
            res.status(200).send({
                message: "post(s) successfully retrived",
                results,
            });
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    },
    postDetails: async (req, res) => {
        try {
            const query = `SELECT posts.id, users.username, posts.image, posts.caption, posts.createdAt AS created_date, COUNT(likes.id) as likes
            FROM posts
            JOIN users ON posts.user_id = users.id
            LEFT JOIN likes ON posts.id = likes.post_id
            WHERE posts.is_active = 1 and posts.id = ${req.params.id}
            GROUP BY posts.id;
            `;
            const [results] = await db.sequelize.query(query);
            res.status(200).send({
                message: "post successfully retrived",
                results,
            });
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    },
    deletePost: async (req, res) => {
        try {
            const result = await post.update(
                { is_active: 0 },
                {
                    where: {
                        id: req.params.id,
                    },
                }
            );
            res.status(200).send({
                message: `post with no id: ${req.params.id} successfully deactivated`,
            });
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    },
    updatePost: async (req, res) => {
        try {
            const result = await post.update(req.body, {
                where: { id: req.params.id },
            });
            res.status(200).send({
                status: true,
                message: `post with id no: ${req.params.id} has been updated`,
            });
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    },
};
