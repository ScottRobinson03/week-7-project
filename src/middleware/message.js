const { Message } = require("../models");

async function isValidMessage(req, resp, next) {
    req.message = await Message.findById(req.params.messageId);
    if (req.message === null) {
        resp.status(404).json({message: "A message with that id could not be found"});
        return;
    }
    next();
}

module.exports = isValidMessage;