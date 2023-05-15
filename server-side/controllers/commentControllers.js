const db = require("../models");
const comment = db.Comment;
const post = db.Post;

module.exports = {
    commentPost: async (req, res) => {
        try {
            const existingPost = await post.findOne({
                where: {
                    id: req.params.id,
                    is_active: 1,
                },
            });

            if (!existingPost) {
                return res.status(404).json({
                    message: "Post not found",
                });
            }

            const { text } = req.body;

            const result = await comment.create({
                post_id: req.params.id,
                user_id: req.userId,
                text: text,
            });

            res.status(200).json({
                message: "Post successfully commented",
                result,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Error commenting post",
            });
        }
    },
    fetchCommentsFromPost: async (req, res) => {
        try {
            const query = `SELECT comments.id AS comment_id, comments.text, comments.createdAt as comment_date,
            comments.post_id,  users.id, users.username
            FROM comments
            INNER JOIN users ON comments.user_id = users.id
            WHERE comments.post_id = ${req.params.id};
            `;
            const [results] = await db.sequelize.query(query);

            res.status(200).json({
                message: "Comment(s) retrived successfully",
                results,
            });
        } catch (err) {
            console.log(err);
            res.status(400).json({
                message: "Error fetching comments",
            });
        }
    },
};
