const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Message } = require("./models");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", async socket => {
    socket.on("chat message", async msg => {
        const msgComponent = new Message({authorName: msg.author, content: msg.content});
        await msgComponent.save();
        io.emit("chat message", {...msg, ...{id: msgComponent._id}});
    });

    socket.on("delete message", async msg => {
        await Message.findByIdAndDelete(msg.id);
        io.emit("delete message", msg);
    });

    socket.on("edit message", async msg => {
        await Message.findByIdAndUpdate(msg.id, {content: msg.newContent});
        io.emit("edit message", msg);
    });
});

module.exports = { app, io, server };