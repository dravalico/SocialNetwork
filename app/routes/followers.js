const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../db/models/user.js");
const { StatusCodes } = require("http-status-codes");
const {
    param,
    query,
    cookies,
    header,
    body,
    validationResult,
} = require("express-validator");

router.get(
    "/:id?",
    [
        param("id")
            .notEmpty()
            .withMessage("The id must be not empty")
            .isNumeric()
            .withMessage("The id must be a number"),
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: error.array() });
        } else {
            const userWithId = await User.findOne({ id: req.params.id });
            if (userWithId) {
                const followersId = userWithId.followers;
                let followers = [];
                for (const followerId of followersId) {
                    let follower = await User.findOne({ id: followerId });
                    followers.push(follower.username);
                }
                return res.status(StatusCodes.OK).send(followers);
            } else {
                return res.status(StatusCodes.NOT_FOUND).send("User not found");
            }
        }
    }
);

router.post(
    "/:id?",
    [
        param("id")
            .notEmpty()
            .withMessage("The id must be not empty")
            .isNumeric()
            .withMessage("The id must be a number"),
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: error.array() });
        } else {
            const cookie = req.headers["jwtoken"];
            let id;
            if (cookie) {
                try {
                    const decoded = jwt.verify(cookie, SECRET_KEY_JWT);
                    id = decoded.id;
                } catch (err) {
                    return res
                        .status(StatusCodes.UNAUTHORIZED)
                        .send("Invalid token");
                }
            } else {
                return res
                    .status(StatusCodes.FORBIDDEN)
                    .send("No token provided");
            }
            const idToFollow = req.params.id;
            if (idToFollow === id) {
                return res
                    .status(StatusCodes.CONFLICT)
                    .send("Cannot follow itself");
            }
            let user = await User.findOne({ id: id });
            let userToFollow = await User.findOne({ id: idToFollow });
            if (user && userToFollow) {
                if (!user.following.includes(idToFollow)) {
                    user = await User.findOneAndUpdate(
                        { id: id },
                        { $push: { following: idToFollow } }
                    );
                    userToFollow = await User.findOneAndUpdate(
                        { id: idToFollow },
                        { $push: { followers: id } }
                    );
                    user = await User.findOne({ id: id });
                    return res.status(StatusCodes.OK).send(user);
                } else {
                    return res
                        .status(StatusCodes.CONFLICT)
                        .send("Already following");
                }
            } else if (userToFollow === undefined) {
                return res.status(StatusCodes.NOT_FOUND).send("User not found");
            }
        }
    }
);

router.delete(
    "/:id?",
    [
        param("id")
            .notEmpty()
            .withMessage("The id must be not empty")
            .isNumeric()
            .withMessage("The id must be a number"),
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: error.array() });
        } else {
            const cookie = req.headers["jwtoken"];
            let id;
            if (cookie) {
                try {
                    const decoded = jwt.verify(cookie, SECRET_KEY_JWT);
                    id = decoded.id;
                } catch (err) {
                    return res
                        .status(StatusCodes.UNAUTHORIZED)
                        .send("Invalid token");
                }
            } else {
                return res
                    .status(StatusCodes.FORBIDDEN)
                    .send("No token provided");
            }
            const idToUnfollow = req.params.id;
            let user = await User.findOne({ id: id });
            let userToUnfollow = await User.findOne({ id: idToUnfollow });
            if (user && userToUnfollow) {
                if (user.following.includes(idToUnfollow)) {
                    user = await User.findOneAndUpdate(
                        { id: id },
                        { $pull: { following: idToUnfollow } }
                    );
                    userToUnfollow = await User.findOneAndUpdate(
                        { id: idToUnfollow },
                        { $pull: { followers: id } }
                    );
                    user = await User.findOne({ id: id });
                    return res.status(StatusCodes.OK).send(user);
                } else {
                    return res
                        .status(StatusCodes.CONFLICT)
                        .send("Not following user");
                }
            } else {
                return res.status(StatusCodes.NOT_FOUND).send("User not found");
            }
        }
    }
);

module.exports = router;
