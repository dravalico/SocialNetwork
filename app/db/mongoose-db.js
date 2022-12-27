const mongoose = require("mongoose");
const url = "mongodb://mongosrv";

let _db;

mongoose.set("strictQuery", false);

module.exports = {
    connect: async function () {
        await mongoose.connect(url, function (err) {
            if (err) {
                throw err;
            }
        });
        _db = mongoose.db.db("social_network_db");
    },
    getDb: () => _db,
};
