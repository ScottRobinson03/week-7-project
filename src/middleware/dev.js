function isThunderClientRequest(req, resp, next) {
    if (req.get("User-Agent") !== "Thunder Client (https://www.thunderclient.com)") {
        resp.status(403).json({message: "This endpoint is for development use only, so can only be reached via thunderclient"});
        return;
    }
    next();
}

module.exports = isThunderClientRequest;