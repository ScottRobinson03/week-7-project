const express = require("express");
const verifyJWT_MW = require("../middleware/tokens");
const { Message } = require("../models");

const router = express.Router();

router.use("/home", verifyJWT_MW, express.static("public/home"));

router.get("/", (_, resp) => {
    resp.redirect("/home");
});

router.get("/messages", verifyJWT_MW, async (_, resp) => {
    resp.json(await Message.find({}));
});

module.exports = router;