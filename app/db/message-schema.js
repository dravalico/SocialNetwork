const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    idCreator: {
        type: Number,
        required: true,
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
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = { Message };
