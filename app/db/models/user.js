const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            index: {
                unique: true,
            },
        },
        name: {
            type: String,
            required: true,
        },
        surname: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            index: {
                unique: true,
            },
        },
        password: {
            type: String,
            required: true,
        },
        bio: {
            type: String,
        },
        followers: [Number],
        following: [Number],
    },
    { versionKey: false }
);

// https://stackoverflow.com/questions/14588032/mongoose-password-hashing
UserSchema.pre("save", function (next) {
    var user = this;
    if (!user.isModified("password")) {
        return next();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};

// https://stackoverflow.com/questions/5794834/how-to-access-a-preexisting-collection-with-mongoose
const User = mongoose.model("User", UserSchema, "user");

module.exports = { User };
