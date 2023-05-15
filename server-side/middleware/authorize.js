const jwt = require("jsonwebtoken");
const db = require("../models");
const user = db.User;

module.exports = {
    login: async (req, res, next) => {
        try {
            let token = req.headers.authorization;
            if (!token)
                throw {
                    message: "Unauthorized",
                };
            token = token.split(" ")[1];

            //mengambil id dari bearer token
            const verifiedUser = jwt.verify(token, "faud");
            console.log(verifiedUser);

            const userExist = await user.findOne({
                where: {
                    id: verifiedUser.id,
                },
            });

            req.userId = userExist.id;

            next();
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    },
};
