const rateLimit = require("express-rate-limit");

const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    skip: (req) => {
        return req.path === "/auth/login";
    },
    
    message: {
        message: "Too many requests. Please try again later."
    }
});

const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        message: "Too many login attempts. Please try again later."
    }
});

module.exports = {
    apiRateLimiter,
    loginRateLimiter
};