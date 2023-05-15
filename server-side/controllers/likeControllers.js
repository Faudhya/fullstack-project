const db = require("../models");
const like = db.like;
const post = db.Post;

module.exports = {
    likePost: async (req, res) => {
        try {
            const { postId } = req.params.id;
            const { userId } = req.body;

            // Check if the post exists
            const existingPost = await post.findOne({
                where: {
                    id: postId,
                    is_active: true,
                },
            });

            if (!existingPost) {
                return res.status(404).json({
                    message: "Post not found",
                });
            }

            // Check if the like already exists
            const existingLike = await like.findOne({
                where: {
                    post_id: postId,
                    user_id: userId,
                },
            });

            if (existingLike) {
                return res.status(400).json({
                    message: "You have already liked this post",
                });
            }

            // Create the new like record
            const result = await like.create({
                post_id: postId,
                user_id: userId,
            });

            res.status(200).json({
                message: "Post liked successfully",
                result,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Error liking post",
            });
        }
    },
};
