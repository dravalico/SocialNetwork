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
    async (req, res, next) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.status(StatusCodes.BAD_REQUEST);
            return next(error.array());
        } else {
            try {
                let userWithId = await User.findOne({
                    id: req.params.id,
                });
                if (userWithId) {
                    return res
                        .status(StatusCodes.OK)
                        .json({ followers: userWithId.followers });
                } else {
                    res.status(StatusCodes.NOT_FOUND);
                    return next("User not found");
                }
            } catch (err) {
                console.log("ERROR: " + err);
                next("Server error");
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
    async (req, res, next) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.status(StatusCodes.BAD_REQUEST);
            return next(error.array());
        } else {
            if (req.isAuth) {
                let id = req.id.toString();
                const idToFollow = req.params.id;
                if (idToFollow === id) {
                    res.status(StatusCodes.CONFLICT);
                    return next("Cannot follow itself");
                }
                try {
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
                            user = await User.findOne({ id: id }).select(
                                "-_id -password"
                            );
                            user = user.toObject();
                            return res
                                .status(StatusCodes.OK)
                                .json({ user: user });
                        } else {
                            res.status(StatusCodes.CONFLICT);
                            return next("Already following");
                        }
                    } else {
                        res.status(StatusCodes.NOT_FOUND);
                        return next("User not found");
                    }
                } catch (err) {
                    console.log("ERROR: " + err);
                    return next("Server error");
                }
            } else {
                res.status(StatusCodes.UNAUTHORIZED);
                next("Unauthorized");
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
    async (req, res, next) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.status(StatusCodes.BAD_REQUEST);
            return next(error.array());
        } else {
            if (req.isAuth) {
                let id = req.id;
                const idToUnfollow = req.params.id;
                try {
                    let user = await User.findOne({ id: id });
                    let userToUnfollow = await User.findOne({
                        id: idToUnfollow,
                    });
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
                            user = await User.findOne({ id: id }).select(
                                "-_id -password"
                            );
                            user = user.toObject();
                            return res
                                .status(StatusCodes.OK)
                                .json({ user: user });
                        } else {
                            res.status(StatusCodes.CONFLICT);
                            return next("Not following user");
                        }
                    } else {
                        res.status(StatusCodes.NOT_FOUND);
                        return next("User not found");
                    }
                } catch (err) {
                    console.log("ERROR: " + err);
                    return next("Server error");
                }
            } else {
                res.status(StatusCodes.UNAUTHORIZED);
                next("Unauthorized");
            }
        }
    }
);

module.exports = router;
