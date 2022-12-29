const { User } = require("../db/user-schema.js");
const { StatusCodes } = require("http-status-codes");
const { generateJWT } = require("../util.js");

const signinController = async (req, res) => {
    const userToLogin = req.body;
    const user = await User.findOne({ username: userToLogin.username });
    if (user) {
        user.comparePassword(userToLogin.password, (err, match) => {
            if (match && !err) {
                const token = generateJWT(userToLogin.id, userToLogin.username);
                return res
                    .cookie("jwtoken", token, {
                        maxAge: 1296000000,
                        httpOnly: true,
                    })
                    .status(StatusCodes.OK)
                    .send(userToLogin);
            } else {
                return res
                    .status(StatusCodes.FORBIDDEN)
                    .send("Invalid credentials");
            }
        });
    } else {
        return res
            .status(StatusCodes.NOT_FOUND)
            .send("No user with those credentials");
    }
};

module.exports = { signinController };
