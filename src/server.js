const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const { authRouter, homeRouter, messageRouter, userRouter } = require("./routes");
const { Message } = require("./models");

const app = express();
process.env["JWT_SECRET"] = "my-secret-text";
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter, homeRouter, messageRouter, userRouter);

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", async socket => {
    socket.on("chat message", async msg => {
        io.emit("chat message", msg);
        const msgComponent = new Message({authorName: msg.author, content: msg.content});
        await msgComponent.save();
    });
});

if (require.main === module) {
    server.listen(5001, async () => {
        await mongoose.connect("mongodb://127.0.0.1/demo", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Listening on port 5001");
    });
}

module.exports = app;