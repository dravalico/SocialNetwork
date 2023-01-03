const express = require("express");
const router = express.Router();
const { User } = require("../db/models/user.js");
const { StatusCodes } = require("http-status-codes");
const { param, validationResult } = require("express-validator");

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
                return res
                    .status(StatusCodes.OK)
                    .json({ followers: followers });
            } else {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: "User not found" });
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
            if (req.isAuth) {
                let id = req.id;
                const idToFollow = req.params.id;
                if (idToFollow === id) {
                    return res
                        .status(StatusCodes.CONFLICT)
                        .json({ error: "Cannot follow itself" });
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
                        return res.status(StatusCodes.OK).json({ user: user });
                    } else {
                        return res
                            .status(StatusCodes.CONFLICT)
                            .json({ error: "Already following" });
                    }
                } else {
                    return res
                        .status(StatusCodes.NOT_FOUND)
                        .json({ error: "User not found" });
                }
            } else {
                return res.status(StatusCodes.UNAUTHORIZED);
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
            if (req.isAuth) {
                let id = req.id;
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
                        return res.status(StatusCodes.OK).json({ user: user });
                    } else {
                        return res
                            .status(StatusCodes.CONFLICT)
                            .json({ error: "Not following user" });
                    }
                } else {
                    return res
                        .status(StatusCodes.NOT_FOUND)
                        .json({ error: "User not found" });
                }
            } else {
                return res.status(StatusCodes.UNAUTHORIZED);
            }
        }
    }
);

module.exports = router;
