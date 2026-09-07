const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
require("dotenv").config();

const pool = require("./config/database");
const authRoutes = require("./routes/auth.routes");
const authenticateToken = require("./middleware/auth.middleware");

const {
    apiRateLimiter
} = require("./middleware/rate-limit.middleware");

const {
    notFoundHandler,
    errorHandler
} = require("./middleware/error.middleware");

const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    })
);

app.use(
    express.json({
        limit: "10kb"
    })
);

app.use(cookieParser());

app.use("/api", apiRateLimiter);

app.get("/", (req, res) => {
    res.json({
        message: "Restaurant System API is running"
    });
});

app.get("/api/health", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            status: "OK",
            database: "Connected",
            server_time: result.rows[0].now
        });
    } catch (error) {
        console.error("Database connection error:", error);

        res.status(500).json({
            status: "ERROR",
            database: "Disconnected"
        });
    }
});

app.use("/api/auth", authRoutes);

app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({
        message: "You have access to this protected route",
        user: req.user
    });
});

app.use(notFoundHandler);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});