const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const { app, server } = require("./io");
const { authRouter, homeRouter, messageRouter, userRouter } = require("./routes");


process.env["JWT_SECRET"] = "my-secret-text";
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter, homeRouter, messageRouter, userRouter);

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