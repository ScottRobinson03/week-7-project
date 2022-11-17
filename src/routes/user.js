const { Router } = require("express");
const { isThunderClientRequest, isValidUsername } = require("../middleware");
const { Message, User } = require("../models");
const router = Router();

async function deleteUser(username) {
    await Message.updateMany({authorName: username}, {authorName: "Deleted User"});
    await User.findOneAndDelete({username: username});
}

router.all("*", isThunderClientRequest);

router.get("/users", async (_, resp) => {
    resp.json(await User.find({}));
});

router.delete("/users", async (_, resp) => {
    (await User.find({})).forEach(user => deleteUser(user.username));
    resp.sendStatus(204) // "no content" response code
})

router.get("/user/:username", isValidUsername, async (req, resp) => {
    resp.json(req.user);
});

router.delete("/user/:username", isValidUsername, async (req, resp) => {
    await deleteUser(req.params.username);
    resp.sendStatus(204); // "no content" response code
});

module.exports = router;