const { Router } = require("express");
const { isThunderClientRequest, isValidMessage, verifyJWT_MW } = require("../middleware");
const { Message } = require("../models");
const router = Router();

router.all("*", isThunderClientRequest)

router.delete("/messages", async (_, resp) => {
    await Message.deleteMany({});
    resp.sendStatus(204); // "no content" response code
});

router.get("/message/:messageId", isValidMessage, async (req, resp) => {
    resp.json(req.message);
});

router.delete("/message/:messageId", isValidMessage, async (req, resp) => {
    await Message.findByIdAndDelete(req.params.messageId);
    resp.sendStatus(204); // "no content" response code
});

module.exports = router;