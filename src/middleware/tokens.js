const { verifyJWTToken } = require("../libs/auth");

async function verifyJWT_MW(req, resp, next) {
    if ((!req.cookies) || (!req.cookies.token)) {
        resp.redirect("/login");
        return;
    }
    try {
        const decodedToken = await verifyJWTToken(req.cookies.token);
        req.user = decodedToken.data;
        next();
    } catch (exc) {
        resp.status(401).json({message: "Invalid author token provided."});
    }
}

module.exports = verifyJWT_MW;