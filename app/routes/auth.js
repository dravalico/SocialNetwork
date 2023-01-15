const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { body, validationResult } = require("express-validator");
const { User } = require("../db/models/user.js");
const { getNextId } = require("../db/helper.js");

function generateJWT(id, username) {
    return jwt.sign(
        { id: id, username: username },
        process.env.JWT_PRIVATE_KEY
    );
}

router.post(
    "/signup",
    [
        body("name")
            .trim()
            .isString()
            .withMessage("The name must be a string")
            .isLength({ min: 2, max: 20 })
            .withMessage(
                "The name must have minimum length of 2 and maximum length of 20"
            ),
        body("surname")
            .trim()
            .isString()
            .withMessage("The surname must be a string")
            .isLength({ min: 2, max: 20 })
            .withMessage(
                "The surname must have minimum length of 2 and maximum length of 20"
            ),
        body("username")
            .trim()
            .isString()
            .withMessage("The username must be a string")
            .isLength({ min: 4, max: 20 })
            .withMessage(
                "The username must have minimum length of 4 and maximum length of 20"
            ),
        body("password")
            .trim()
            .isString()
            .withMessage("The password must be a string")
            .isLength({ min: 8 })
            .withMessage("The password must have minimum length of 8"),
        body("bio")
            .isString()
            .withMessage("The bio must be a string")
            .isLength({ min: 0, max: 250 })
            .withMessage("The bio must have maximum length of 250")
            .trim(),
        body("confirmPassword").custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Confirm password does not match");
            }
            return true;
        }),
    ],
    async (req, res, next) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.status(StatusCodes.BAD_REQUEST);
            return next(error.array());
        } else {
            const userToInsert = req.body;
            if (await isAlreadyInDb(userToInsert.username)) {
                res.status(StatusCodes.CONFLICT);
                return next("Username already taken");
            }
            delete userToInsert.confirmPassword;
            userToInsert.id = await getNextId(User);
            userToInsert.followersId = [];
            userToInsert.followingId = [];
            const token = generateJWT(userToInsert.id, userToInsert.username);
            try {
                let insertedUser = await new User({ ...userToInsert }).save();
                insertedUser = insertedUser.toObject();
                delete insertedUser.password;
                delete insertedUser._id;
                return res
                    .cookie(process.env.JWT_COOKIE_NAME, token, {
                        maxAge: 1296000000,
                        httpOnly: true,
                    })
                    .status(StatusCodes.CREATED)
                    .json(insertedUser);
            } catch (err) {
                console.log("ERROR: " + err);
                next("Server error");
            }
        }
    }
);

router.post(
    "/signin",
    [
        body("username")
            .trim()
            .isString()
            .withMessage("The username must be a string"),
        body("password")
            .trim()
            .isString()
            .withMessage("The password must be a string"),
    ],
    async (req, res, next) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.status(StatusCodes.BAD_REQUEST);
            return next(error.array());
        } else {
            const userToLogin = req.body;
            try {
                let user = await User.findOne({
                    username: userToLogin.username,
                });
                if (user) {
                    user.comparePassword(userToLogin.password, (err, match) => {
                        if (match && !err) {
                            const token = generateJWT(user.id, user.username);
                            user = user.toObject();
                            delete user._id;
                            delete user.password;
                            return res
                                .cookie(process.env.JWT_COOKIE_NAME, token, {
                                    maxAge: 1296000000,
                                    httpOnly: true,
                                })
                                .status(StatusCodes.OK)
                                .json(user);
                        }
                        res.status(StatusCodes.FORBIDDEN);
                        return next("Invalid credentials");
                    });
                } else {
                    res.status(StatusCodes.NOT_FOUND);
                    return next("The user does not exist");
                }
            } catch (err) {
                console.log("ERROR: " + err);
                next("Server error");
            }
        }
    }
);

router.get("/logout", (req, res, next) => {
    if (req.isAuth) {
        return res
            .clearCookie("jwtoken")
            .status(StatusCodes.OK)
            .json({ done: "Logout ok" });
    } else {
        res.status(StatusCodes.UNAUTHORIZED);
        next("Unauthorized");
    }
});

async function isAlreadyInDb(username) {
    const user = await User.findOne({ username: username });
    return user ? true : false;
}

module.exports = router;
