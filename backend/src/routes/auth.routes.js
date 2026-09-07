const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const pool = require("../config/database");
const authenticateToken = require("../middleware/auth.middleware");

const {
    loginRateLimiter
} = require("../middleware/rate-limit.middleware");

const {
    validateLogin
} = require("../validators/auth.validators");

const {
    generateRefreshToken,
    hashRefreshToken,
    createAccessToken,
    getRefreshTokenExpiration,
    getAccessCookieOptions,
    getRefreshCookieOptions
} = require("../utils/auth.utils");

const {
    generateCsrfToken,
    hashCsrfToken,
    csrfCookieOptions
} = require("../middleware/csrf.middleware");

const {
    csrfProtection
} = require("../middleware/csrf.middleware");

const router = express.Router();

router.get("/csrf", (req, res) => {
    const csrfToken = generateCsrfToken();

    const csrfTokenHash =
        hashCsrfToken(csrfToken);

    res.cookie(
        "csrf_token_hash",
        csrfTokenHash,
        csrfCookieOptions
    );

    res.setHeader(
        "Cache-Control",
        "no-store"
    );

    return res.json({
        csrfToken
    });
});

// ============================================
// LOGIN
// ============================================

router.post(
    "/login",
    loginRateLimiter,
    csrfProtection,
    validateLogin,
    async (req, res) => {
        try {
            const { username, password } = req.body;

            const result = await pool.query(
                `
                SELECT
                    user_id,
                    username,
                    first_name,
                    last_name,
                    email,
                    password_hash,
                    role,
                    is_active
                FROM users
                WHERE username = $1
                `,
                [username]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({
                    message: "Invalid username or password"
                });
            }

            const user = result.rows[0];

            if (!user.is_active) {
                return res.status(401).json({
                    message: "Invalid username or password"
                });
            }

            const passwordMatch = await bcrypt.compare(
                password,
                user.password_hash
            );

            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Invalid username or password"
                });
            }

            // Create short-lived access token
            const accessToken = createAccessToken(user);

            // Create refresh token
            const refreshToken = generateRefreshToken();

            const refreshTokenHash =
                hashRefreshToken(refreshToken);

            const refreshTokenExpiration =
                getRefreshTokenExpiration();

            // Store only the refresh token hash
            await pool.query(
                `
                INSERT INTO sessions (
                    session_id,
                    user_id,
                    refresh_token_hash,
                    expires_at
                )
                VALUES ($1, $2, $3, $4)
                `,
                [
                    crypto.randomUUID(),
                    user.user_id,
                    refreshTokenHash,
                    refreshTokenExpiration
                ]
            );

            // Access token cookie
            res.cookie(
                "access_token",
                accessToken,
                getAccessCookieOptions()
            );

            // Refresh token cookie
            res.cookie(
                "refresh_token",
                refreshToken,
                getRefreshCookieOptions()
            );

            res.json({
                message: "Login successful",
                user: {
                    user_id: user.user_id,
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role
                }
            });

        } catch (error) {
            console.error("Login error:", error);

            res.status(500).json({
                message: "Internal server error"
            });
        }
    }
);


// ============================================
// CURRENT SESSION
// ============================================

router.get(
    "/me",
    authenticateToken,
    async (req, res) => {
        try {
            const result = await pool.query(
                `
                SELECT
                    user_id,
                    username,
                    first_name,
                    last_name,
                    email,
                    role,
                    is_active
                FROM users
                WHERE user_id = $1
                `,
                [req.user.user_id]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({
                    message: "User not found"
                });
            }

            const user = result.rows[0];

            if (!user.is_active) {
                return res.status(403).json({
                    message: "User account is inactive"
                });
            }

            res.json({
                user: {
                    user_id: user.user_id,
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role
                }
            });

        } catch (error) {
            console.error(
                "Session verification error:",
                error
            );

            res.status(500).json({
                message: "Internal server error"
            });
        }
    }
);


// ============================================
// REFRESH SESSION
// ============================================

router.post(
    "/refresh",
    csrfProtection,
    async (req, res) => {
        const refreshToken =
            req.cookies.refresh_token;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token required"
            });
        }

        const refreshTokenHash =
            hashRefreshToken(refreshToken);

        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const sessionResult = await client.query(
                `
                SELECT
                    session_id,
                    user_id,
                    refresh_token_hash,
                    expires_at,
                    revoked_at
                FROM sessions
                WHERE refresh_token_hash = $1
                FOR UPDATE
                `,
                [refreshTokenHash]
            );

            if (sessionResult.rows.length === 0) {
                await client.query("ROLLBACK");

                return res.status(401).json({
                    message: "Invalid or expired session"
                });
            }

            const session = sessionResult.rows[0];

            // Detect reuse of a revoked refresh token
            if (session.revoked_at) {
                await client.query(
                    `
                    UPDATE sessions
                    SET revoked_at = CURRENT_TIMESTAMP
                    WHERE user_id = $1
                    AND revoked_at IS NULL
                    `,
                    [session.user_id]
                );

                await client.query("COMMIT");

                res.clearCookie(
                    "access_token",
                    getAccessCookieOptions()
                );

                res.clearCookie(
                    "refresh_token",
                    getRefreshCookieOptions()
                );

                res.clearCookie(
                    "csrf_token_hash",
                    csrfCookieOptions
                );

                return res.status(401).json({
                    message: "Session revoked"
                });
            }

            // Check expiration
            if (
                new Date(session.expires_at)
                <= new Date()
            ) {
                await client.query(
                    `
                    UPDATE sessions
                    SET revoked_at = CURRENT_TIMESTAMP
                    WHERE session_id = $1
                    `,
                    [session.session_id]
                );

                await client.query("COMMIT");

                res.clearCookie(
                    "access_token",
                    getAccessCookieOptions()
                );

                res.clearCookie(
                    "refresh_token",
                    getRefreshCookieOptions()
                );

                res.clearCookie(
                    "csrf_token_hash",
                    csrfCookieOptions
                );

                return res.status(401).json({
                    message: "Session expired"
                });
            }

            // Get current user information
            const userResult = await client.query(
                `
                SELECT
                    user_id,
                    username,
                    role,
                    is_active
                FROM users
                WHERE user_id = $1
                `,
                [session.user_id]
            );

            if (userResult.rows.length === 0) {
                await client.query("ROLLBACK");

                return res.status(401).json({
                    message: "Invalid session"
                });
            }

            const user = userResult.rows[0];

            // Do not refresh sessions for inactive users
            if (!user.is_active) {
                await client.query(
                    `
                    UPDATE sessions
                    SET revoked_at = CURRENT_TIMESTAMP
                    WHERE user_id = $1
                    AND revoked_at IS NULL
                    `,
                    [user.user_id]
                );

                await client.query("COMMIT");

                res.clearCookie(
                    "access_token",
                    getAccessCookieOptions()
                );

                res.clearCookie(
                    "refresh_token",
                    getRefreshCookieOptions()
                );

                res.clearCookie(
                    "csrf_token_hash",
                    csrfCookieOptions
                );

                return res.status(401).json({
                    message: "Invalid session"
                });
            }

            // Create a new refresh token
            const newRefreshToken =
                generateRefreshToken();

            const newRefreshTokenHash =
                hashRefreshToken(newRefreshToken);

            const newSessionId =
                crypto.randomUUID();

            const newExpiration =
                getRefreshTokenExpiration();

            // Create new session
            await client.query(
                `
                INSERT INTO sessions (
                    session_id,
                    user_id,
                    refresh_token_hash,
                    expires_at
                )
                VALUES ($1, $2, $3, $4)
                `,
                [
                    newSessionId,
                    user.user_id,
                    newRefreshTokenHash,
                    newExpiration
                ]
            );

            // Revoke old session
            await client.query(
                `
                UPDATE sessions
                SET revoked_at = CURRENT_TIMESTAMP
                WHERE session_id = $1
                `,
                [session.session_id]
            );

            await client.query("COMMIT");

            // Create new access token
            const newAccessToken =
                createAccessToken(user);

            // Update cookies
            res.cookie(
                "access_token",
                newAccessToken,
                getAccessCookieOptions()
            );

            res.cookie(
                "refresh_token",
                newRefreshToken,
                getRefreshCookieOptions()
            );

            return res.json({
                message: "Session refreshed"
            });

        } catch (error) {
            try {
                await client.query("ROLLBACK");
            } catch (rollbackError) {
                console.error(
                    "Rollback error:",
                    rollbackError
                );
            }

            console.error(
                "Refresh session error:",
                error
            );

            return res.status(500).json({
                message: "Internal server error"
            });

        } finally {
            client.release();
        }
    }
);


// ============================================
// LOGOUT
// ============================================

router.post(
    "/logout",
    csrfProtection,
    async (req, res) => {
        try {
            const refreshToken =
                req.cookies.refresh_token;

            if (refreshToken) {
                const refreshTokenHash =
                    hashRefreshToken(refreshToken);

                await pool.query(
                    `
                    UPDATE sessions
                    SET revoked_at = CURRENT_TIMESTAMP
                    WHERE refresh_token_hash = $1
                    AND revoked_at IS NULL
                    `,
                    [refreshTokenHash]
                );
            }

            res.clearCookie(
                "access_token",
                getAccessCookieOptions()
            );

            res.clearCookie(
                "refresh_token",
                getRefreshCookieOptions()
            );

            res.clearCookie(
                "csrf_token_hash",
                csrfCookieOptions
            );

            return res.json({
                message: "Logout successful"
            });

        } catch (error) {
            console.error(
                "Logout error:",
                error
            );

            return res.status(500).json({
                message: "Internal server error"
            });
        }
    }
);

module.exports = router;