const notFoundHandler = (req, res) => {
    res.status(404).json({
        message: "Resource not found"
    });
};

const errorHandler = (err, req, res, next) => {
    console.error("Unhandled server error:", err);

    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message:
            statusCode === 500
                ? "Internal server error"
                : err.message
    });
};

module.exports = {
    notFoundHandler,
    errorHandler
};