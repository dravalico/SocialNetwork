const { User } = require("./db/user-schema.js");
const jwt = require("jsonwebtoken");

async function getLastElementId(Schema) {
    const lastIdObject = await Schema.find({}).sort({ _id: -1 }).limit(1);
    if (lastIdObject.length === 0) {
        return 0;
    } else {
        return parseInt(lastIdObject[0].id);
    }
}

const SECRET_KEY_JWT = "will it work?";

function generateJWT(id, username) {
    return jwt.sign({ id, username }, SECRET_KEY_JWT);
}

module.exports = { getLastElementId, generateJWT };
