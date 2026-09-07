const crypto = require("crypto");

const SAFE_METHODS = new Set([
    "GET",
    "HEAD",
    "OPTIONS"
]);

const getAllowedOrigin = () => {
    return process.env.FRONTEND_URL;
};

const generateCsrfToken = () => {
    return crypto.randomBytes(32).toString("hex");
};

const hashCsrfToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};

const csrfCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
    path: "/"
};

const csrfProtection = (req, res, next) => {
    if (SAFE_METHODS.has(req.method)) {
        return next();
    }

    const allowedOrigin = getAllowedOrigin();
    const requestOrigin = req.get("origin");

    if (!requestOrigin || requestOrigin !== allowedOrigin) {
        return res.status(403).json({
            message: "Invalid request origin"
        });
    }

    const csrfToken = req.get("X-CSRF-Token");
    const csrfCookieHash = req.cookies.csrf_token_hash;

    if (!csrfToken || !csrfCookieHash) {
        return res.status(403).json({
            message: "CSRF protection required"
        });
    }

    if (csrfToken.length > 128) {
        return res.status(403).json({
            message: "Invalid CSRF token"
        });
    }

    const receivedHash = hashCsrfToken(csrfToken);

    const receivedHashBuffer =
        Buffer.from(receivedHash, "hex");

    const storedHashBuffer =
        Buffer.from(csrfCookieHash, "hex");

    if (
        receivedHashBuffer.length !==
        storedHashBuffer.length
    ) {
        return res.status(403).json({
            message: "Invalid CSRF token"
        });
    }

    const tokenMatches = crypto.timingSafeEqual(
        receivedHashBuffer,
        storedHashBuffer
    );

    if (!tokenMatches) {
        return res.status(403).json({
            message: "Invalid CSRF token"
        });
    }

    next();
};

module.exports = {
    generateCsrfToken,
    hashCsrfToken,
    csrfCookieOptions,
    csrfProtection
};