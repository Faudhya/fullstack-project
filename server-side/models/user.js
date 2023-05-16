"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.hasOne(models.Profile, {
                foreignKey: {
                    name: "user_id",
                },
            });
            User.hasMany(models.Post, {
                foreignKey: {
                    name: "user_id",
                },
            });
            User.hasOne(models.Like, {
                foreignKey: {
                    name: "user_id",
                },
            });
            User.hasMany(models.Comment, {
                foreignKey: {
                    name: "user_id",
                },
            });
        }
    }
    User.init(
        {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: "username",
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: "email",
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [8],
                },
            },
            is_verified: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            verification_token: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "User",
        }
    );
    return User;
};
