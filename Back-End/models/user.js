const mongoose = require("mongoose");

require("dotenv").config();

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 3, maxlength: 30}, //remmeber curly brackets mean this is an object
    email: {type: String, required: true, minlength: 3, maxlength: 200, unique: true},
    password: {type: String, required: true, minlength: 3, maxlength: 1024} //we will be hasing the password, so long
});

//This is just the properites for the user, AKA the schema

const User = mongoose.model("User", userSchema);//first pass name of collection

exports.User = User;

//Dependencies:
//jsonwebtoken - will send token to user to let them know they are logged in, validates log in
//bcrypt - for hashing the password
//joi - handling incoming data 