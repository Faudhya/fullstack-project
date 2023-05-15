const express = require("express");
const PORT = 2000;
const server = express();
const cors = require("cors");
const db = require("./models");

server.use(express.json());
server.use(cors());

const { authRouters, postRouters } = require("./routers");

server.use("/auth", authRouters);
server.use("/post", postRouters);

server.listen(PORT, () => {
    // db.sequelize.sync({ alter: true });
    console.log("Success Running at PORT: " + PORT);
});
