const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { cookies, body, validationResult } = require("express-validator");
const { User } = require("../db/models/user.js");
const { getLastElementId } = require("../util.js");

const SECRET_KEY_JWT = "will it work?";

function generateJWT(id, username) {
    return jwt.sign({ id: id, username: username }, SECRET_KEY_JWT);
}

router.post(
    "/signup",
    [
        body("name")
            .isString()
            .withMessage("The name must be a string")
            .isLength({ min: 2 })
            .withMessage("The name must have minimum length of 2")
            .trim(),
        body("surname")
            .isString()
            .withMessage("The surname must be a string")
            .isLength({ min: 2 })
            .withMessage("The surname must have minimum length of 2")
            .trim(),
        body("username")
            .isString()
            .withMessage("The username must be a string")
            .isLength({ min: 4 })
            .withMessage("The username must have minimum length of 4")
            .trim(),
        body("password")
            .isString()
            .withMessage("The password must be a string")
            .isLength({ min: 8 })
            .withMessage("The password must have minimum length of 8")
            .trim(),
        body("bio").isString().withMessage("The bio must be a string").trim(),
        body("confirmPassword").custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("confirm password does not match");
            }
            return true;
        }),
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: error.array() });
        } else {
            const userToInsert = req.body;
            if (await isAlreadyInDb(userToInsert.username)) {
                return res
                    .status(StatusCodes.CONFLICT)
                    .json("Username already taken");
            }
            delete userToInsert.confirmPassword;
            userToInsert.id = (await getLastElementId(User)) + 1;
            userToInsert.followersId = [];
            userToInsert.followingId = [];
            const token = generateJWT(userToInsert.id, userToInsert.username);
            const insertedUser = await new User({ ...userToInsert })
                .save()
                .catch(() => {
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
                });
            return res
                .cookie("jwtoken", token, {
                    maxAge: 1296000000,
                    httpOnly: true,
                })
                .status(StatusCodes.CREATED)
                .json(userToInsert);
        }
    }
);

router.post(
    "/signin",
    [
        body("username")
            .isString()
            .withMessage("The username must be a string")
            .isLength({ min: 4 })
            .withMessage("The username must have minimum length of 4")
            .trim(),
        body("password")
            .isString()
            .withMessage("The password must be a string")
            .isLength({ min: 8 })
            .withMessage("The password must have minimum length of 8")
            .trim(),
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: error.array() });
        } else {
            const userToLogin = req.body;
            const user = await User.findOne({
                username: userToLogin.username,
            });
            if (user) {
                user.comparePassword(userToLogin.password, (err, match) => {
                    if (match && !err) {
                        const token = generateJWT(
                            userToLogin.id,
                            userToLogin.username
                        );
                        return res
                            .cookie("jwtoken", token, {
                                maxAge: 1296000000,
                                httpOnly: true,
                            })
                            .status(StatusCodes.OK)
                            .json(userToLogin);
                    } else {
                        return res
                            .status(StatusCodes.FORBIDDEN)
                            .json("Invalid credentials");
                    }
                });
            } else {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: "No user with those credentials" });
            }
        }
    }
);

async function isAlreadyInDb(username) {
    const user = await User.findOne({ username: username });
    return user ? true : false;
}

module.exports = router;
