"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Post.belongsTo(models.User, {
                foreignKey: {
                    name: "user_id",
                },
            });
            Post.hasMany(models.Like, {
                foreignKey: {
                    name: "post_id",
                },
            });
            Post.hasMany(models.Comment, {
                foreignKey: {
                    name: "post_id",
                },
            });
        }
    }
    Post.init(
        {
            image: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            caption: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: "Post",
        }
    );
    return Post;
};
