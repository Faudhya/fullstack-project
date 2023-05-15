"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Profile extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Profile.belongsTo(models.User, {
                foreignKey: {
                    name: "user_id",
                },
            });
        }
    }
    Profile.init(
        {
            full_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            bio: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            profile_picture: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Profile",
        }
    );
    return Profile;
};
