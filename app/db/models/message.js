const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            index: {
                unique: true,
            },
        },
        idCreator: {
            type: Number,
            required: true,
            index: true,
        },
        date: {
            type: Date,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        likes: [Number],
    },
    { versionKey: false }
);

const Message = mongoose.model("Message", MessageSchema, "messages");

module.exports = { Message };
