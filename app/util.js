const jwt = require("jsonwebtoken");

async function getLastElementId(Schema) {
    const lastIdObject = await Schema.find().sort({ id: -1 }).limit(1);
    if (lastIdObject.length === 0) {
        return 0;
    } else {
        return parseInt(lastIdObject[0].id);
    }
}

module.exports = { getLastElementId };
