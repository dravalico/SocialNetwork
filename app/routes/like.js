const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../db/models/user.js");
const { Message } = require("../db/models/message.js");
const { StatusCodes } = require("http-status-codes");
const {
    param,
    query,
    cookies,
    header,
    body,
    validationResult,
} = require("express-validator");

router.post(
    "/:idMessage?",
    [
        param("idMessage")
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
            const idToLike = req.params.idMessage;
            let user = await User.findOne({ id: id });
            let messageToLike = await Message.findOne({ id: idToLike });
            if (user) {
                if (messageToLike) {
                    if (!messageToLike.likes.includes(id)) {
                        messageToLike = await Message.findOneAndUpdate(
                            { id: idToLike },
                            { $push: { likes: id } }
                        );
                        messageToLike = await Message.findOne({ id: idToLike });
                        return res.status(StatusCodes.OK).send(messageToLike);
                    } else {
                        return res
                            .status(StatusCodes.CONFLICT)
                            .send("Already liked");
                    }
                } else {
                    return res
                        .status(StatusCodes.NOT_FOUND)
                        .send("Message not found");
                }
            } else {
                return res.status(StatusCodes.NOT_FOUND).send("User not found");
            }
        }
    }
);

router.delete(
    "/:idMessage?",
    [
        param("idMessage")
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
            const idToUnlike = req.params.idMessage;
            let user = await User.findOne({ id: id });
            let messageToUnlike = await Message.findOne({ id: idToUnlike });
            if (user) {
                if (messageToUnlike) {
                    if (messageToUnlike.likes.includes(id)) {
                        messageToUnlike = await Message.findOneAndUpdate(
                            { id: idToUnlike },
                            { $pull: { likes: id } }
                        );
                        messageToUnlike = await Message.findOne({
                            id: idToUnlike,
                        });
                        return res.status(StatusCodes.OK).send(messageToUnlike);
                    } else {
                        return res
                            .status(StatusCodes.CONFLICT)
                            .send("Not liked yet");
                    }
                } else {
                    return res
                        .status(StatusCodes.NOT_FOUND)
                        .send("Message not found");
                }
            } else {
                return res.status(StatusCodes.NOT_FOUND).send("User not found");
            }
        }
    }
);

module.exports = router;
