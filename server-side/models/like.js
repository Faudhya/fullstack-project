"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Like extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Like.belongsTo(models.Post, {
                foreignKey: {
                    name: "post_id",
                },
            });
            Like.belongsTo(models.User, {
                foreignKey: {
                    name: "user_id",
                },
            });
        }
    }
    Like.init(
        {},
        {
            sequelize,
            modelName: "Like",
        }
    );
    return Like;
};
