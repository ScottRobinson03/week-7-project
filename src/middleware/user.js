const { User } = require("../models");

async function isValidUsername(req, resp, next) {
    req.user = await User.findOne({username: req.params.username});
    if (req.user === null) {
        resp.status(404).json({message: "A user with that username could not be found"});
        return;
    }
    next();
}

module.exports = isValidUsername;