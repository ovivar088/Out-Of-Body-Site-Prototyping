const jwt = require("jsonwebtoken");
// const { model } = require("mongoose");

const generateAuthToken = (user) => {
    const secretKey = process.env.JWT_SECRET_KEY

    const token = jwt.sign({
        _id: user.id, 
        name: user.name, 
        email: user.email
    },
    secretKey
    );

    return token;
};

module.exports = generateAuthToken;