const { verifyJWTToken } = require("../libs/auth");

async function verifyJWT_MW(req, resp, next) {
    if (req.get("User-Agent") === "Thunder Client (https://www.thunderclient.com)") { // thunderclient bypasses the token check
        next();
        return;
    }
    if ((!req.cookies) || (!req.cookies.token)) {
        resp.redirect("/login");
        return;
    }
    try {
        const decodedToken = await verifyJWTToken(req.cookies.token);
        req.user = decodedToken.data;
        next();
    } catch (exc) {
        resp.status(401).json({message: `Invalid author token provided: ${exc.message}`});
    }
}

module.exports = verifyJWT_MW;