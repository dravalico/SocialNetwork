const { User } = require("../db/user-schema.js");
const { StatusCodes } = require("http-status-codes");
const { getLastElementId, generateJWT } = require("../util.js");

const signupController = async (req, res) => {
    const userToInsert = req.body;
    delete userToInsert.confirmPassword;
    userToInsert.id = (await getLastElementId(User)) + 1;
    userToInsert.followersId = [];
    userToInsert.followingId = [];
    const token = generateJWT(userToInsert.id, userToInsert.username);
    const insertedUser = await new User({ ...userToInsert })
        .save()
        .catch((err) => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        });
    return res
        .cookie("jwtoken", token, {
            maxAge: 1296000000,
            httpOnly: true,
        })
        .status(StatusCodes.CREATED)
        .send(userToInsert);
};

module.exports = { signupController };
