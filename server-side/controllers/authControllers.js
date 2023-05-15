const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = db.User;
const nodemailer = require("../helpers/nodemailer");
const { Op } = require("sequelize");

module.exports = {
    register: async (req, res) => {
        try {
            const { username, email, password, password_confirmation } =
                req.body;

            console.log(req.body);

            if (!username || !email || !password)
                throw "please complete your data";

            if (password !== password_confirmation)
                throw "Password does not match";

            const passwordRegex =
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/;
            if (!passwordRegex.test(password))
                throw "Password must contain at least 8 characters including an uppercase letter, a symbol, and a number";

            const salt = await bcrypt.genSalt(10);
            const hashPass = await bcrypt.hash(password, salt);

            const result = await user.create({
                username,
                email,
                password: hashPass,
            });

            let payload = { id: result.id };
            const token = jwt.sign(payload, "faud", { expiresIn: "1h" });

            let mail = {
                from: `Admin <randomfactsfaud@gmail.com>`,
                to: `${email}`,
                subject: `Verify your account`,
                html: `
                <div>
                <p>Thank you for registering, you need to activate your account,</p>
                <a href="http://localhost:3000/user/verification/${token}">Click Here</a>
                <span>to activate</span>
                </div>
                `,
            };
            let response = await nodemailer.sendMail(mail);
            console.log(response);

            res.status(200).send({
                status: true,
                data: result,
                message: "register success",
            });
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    },
    login: async (req, res) => {
        try {
            const { emailOrUsername, password } = req.body;

            if (!emailOrUsername || !password)
                throw "please complete your data";

            const userExist = await user.findOne({
                where: {
                    [Op.or]: [
                        { email: emailOrUsername },
                        { username: emailOrUsername },
                    ],
                },
            });

            if (!userExist)
                throw {
                    status: false,
                    message: "User not found",
                };

            const isvalid = await bcrypt.compare(password, userExist.password);

            if (!isvalid)
                throw {
                    status: false,
                    message: "Wrong password",
                };

            const payload = {
                id: userExist.id,
                is_verified: userExist.is_verified,
            };

            const token = jwt.sign(payload, "faud", { expiresIn: "1h" });

            //mengambil id dari bearer token
            const verifiedUser = jwt.verify(token, "faud");
            console.log(verifiedUser);

            //pengecekan verifikasi
            if (!verifiedUser.is_verified) {
                throw "please verify your account";
            } else {
                res.status(200).send({
                    status: true,
                    message: "login success",
                    data: userExist,
                    token,
                });
            }
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    },
};
