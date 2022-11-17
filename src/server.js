const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const { homeRouter, authRouter } = require("./routes");

const app = express();
process.env["JWT_SECRET"] = "my-secret-text";
app.use(express.json());
app.use(cookieParser());
app.use("/", homeRouter);
app.use("/", authRouter);

if (require.main === module) {
    app.listen(5001, async () => {
        await mongoose.connect("mongodb://127.0.0.1/demo", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Listening on port 5001");
    });
}

module.exports = app;