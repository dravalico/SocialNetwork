async function getNextId(Schema) {
    try {
        const lastIdObject = await Schema.find().sort({ id: -1 }).limit(1);
        return lastIdObject[0]?.id === undefined ? 1 : lastIdObject[0].id + 1;
    } catch (err) {
        throw err;
    }
}

module.exports = { getNextId };
