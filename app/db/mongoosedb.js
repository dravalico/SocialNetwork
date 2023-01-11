const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

module.exports = {
    connect: async function () {
        await mongoose.connect(process.env.MONGO_URL, function (err) {
            if (err) {
                throw err;
            }
        });
    },
};
