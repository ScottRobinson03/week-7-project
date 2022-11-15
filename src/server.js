const express = require("express");

const app = express();
app.use(express.json());
app.use("/", express.static("public"));

if (require.main === module) {
    app.listen(5001, () => {
        console.log("Listening on port 5001");
    });
}

module.exports = app;