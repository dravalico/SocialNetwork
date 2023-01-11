const mongoose = require("mongoose");
const { mongoUrl } = require("../config.js");

mongoose.set("strictQuery", false);

module.exports = {
    connect: async function () {
        await mongoose.connect(mongoUrl, function (err) {
            if (err) {
                throw err;
            }
        });
    },
};
