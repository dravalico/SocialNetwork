const mongoose = require("mongoose");
const { User } = require("./models/user.js");
const { Message } = require("./models/message.js");
const usersData = require("./mongo-seed/user-init.json");
const messagesData = require("./mongo-seed/message-init.json");
const { logger } = require("../logger.js");

mongoose.set("strictQuery", false);

module.exports = {
    connect: function () {
        mongoose.connect(process.env.MONGO_URL, (err) => {
            if (err) {
                logger.error("cannot connect to db" + err);
            } else {
                if (process.env.WITH_SAMPLE_DATA === "true") {
                    logger.info("option to upload seed data in db checked");
                    mongoose.connection.db
                        .collection("users")
                        .count(async (err, count) => {
                            if (err) {
                                logger.error("db data upload failed" + err);
                                return;
                            }
                            if (count == 0) {
                                logger.info("uploading db seed data...");
                                for (let i in usersData) {
                                    try {
                                        await new User({
                                            ...usersData[i],
                                        }).save();
                                    } catch (err) {
                                        logger.error(
                                            "db data upload failed" + err
                                        );
                                    }
                                }
                                for (let i in messagesData) {
                                    try {
                                        await new Message({
                                            ...messagesData[i],
                                        }).save();
                                    } catch (err) {
                                        logger.error(
                                            "db data upload failed" + err
                                        );
                                    }
                                }
                                logger.info("upload to db completed");
                            } else {
                                logger.info(
                                    "documents found in db, loading of seed data aborted"
                                );
                            }
                        });
                } else {
                    logger.info("option to upload seed data in db not checked");
                }
            }
        });
    },
};
