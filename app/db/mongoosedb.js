const mongoose = require("mongoose");
const { User } = require("./models/user.js");
const { Message } = require("./models/message.js");
const usersData = require("./mongo-seed/user-init.json");
const messagesData = require("./mongo-seed/message-init.json");

mongoose.set("strictQuery", false);

module.exports = {
    connect: function () {
        mongoose.connect(process.env.MONGO_URL, (err) => {
            if (err) {
                console.log("ERROR: cannot connect to db");
                console.log(err);
            }
            if (process.env.WITH_SAMPLE_DATA) {
                console.log("INFO: option to upload seed data in db checked");
                mongoose.connection.db
                    .collection("user")
                    .count(async (err, count) => {
                        if (count == 0) {
                            console.log("INFO: uploading db seed data...");
                            for (let i in usersData) {
                                try {
                                    await new User({ ...usersData[i] }).save();
                                } catch {
                                    console.log("ERROR: db data upload failed");
                                }
                            }
                            for (let i in messagesData) {
                                try {
                                    await new Message({
                                        ...messagesData[i],
                                    }).save();
                                } catch {
                                    console.log("ERROR: db data upload failed");
                                }
                            }
                            console.log("INFO: upload to db completed");
                        } else {
                            console.log(
                                "INFO: documents found in db, loading of seed data aborted"
                            );
                        }
                    });
            }
        });
    },
};
