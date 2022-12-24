const { MongoClient } = require("mongodb");
const url = "mongodb://mongosrv";
//const url = "mongodb://admin:password@mongosrv:27017?authSource=admin";
const client = new MongoClient(url);

let _db;

module.exports = {
    connect: async function () {
        await client.connect();
        _db = client.db("social_network_db");
    },
    getDb: () => _db,
};
