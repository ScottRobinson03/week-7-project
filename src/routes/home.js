const express = require("express");
const { verifyJWT_MW } = require("../middleware");
const { Message } = require("../models");

const router = express.Router();

router.use("/home", verifyJWT_MW, express.static("public/home"));

router.get("/", (_, resp) => {
    resp.redirect("/home");
});

module.exports = router;