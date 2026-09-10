const { body, validationResult } = require("express-validator");

const validateLogin = [
    body("username")
        .isString()
        .withMessage("Username must be a string")
        .bail()
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("Username must be between 3 and 50 characters"),

    body("password")
        .isString()
        .withMessage("Password must be a string")
        .bail()
        .isLength({ min: 8, max: 128 })
        .withMessage("Password must be between 8 and 128 characters"),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Datos de solicitud no válidos",
                errors: errors.array()
            });
        }

        next();
    }
];

module.exports = {
    validateLogin
};