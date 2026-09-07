const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex");
};

const hashRefreshToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};

const createAccessToken = (user) => {
    return jwt.sign(
        {
            user_id: user.user_id,
            username: user.username,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m"
        }
    );
};

const getRefreshTokenExpiration = () => {
    const days = Number(
        process.env.REFRESH_TOKEN_EXPIRES_DAYS || 7
    );

    const expiresAt = new Date();

    expiresAt.setDate(
        expiresAt.getDate() + days
    );

    return expiresAt;
};

const getAccessCookieOptions = () => {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
        path: "/"
    };
};

const getRefreshCookieOptions = () => {
    const days = Number(
        process.env.REFRESH_TOKEN_EXPIRES_DAYS || 7
    );

    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: days * 24 * 60 * 60 * 1000,
        path: "/api/auth"
    };
};

module.exports = {
    generateRefreshToken,
    hashRefreshToken,
    createAccessToken,
    getRefreshTokenExpiration,
    getAccessCookieOptions,
    getRefreshCookieOptions
};