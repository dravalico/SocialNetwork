const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

module.exports = {
    connect: function () {
        mongoose.connect(process.env.MONGO_URL, function (err) {
            if (err) {
                throw err;
            }
        });
    },
};
