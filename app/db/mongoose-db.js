const mongoose = require("mongoose");
const url = "mongodb://mongosrv";

mongoose.set("strictQuery", false);

module.exports = {
    connect: async function () {
        await mongoose.connect(url, function (err) {
            if (err) {
                throw err;
            }
        });
    },
};
