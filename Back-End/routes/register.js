const bcrypt = require("bcrypt");
const express = require("express");
const Joi = require("joi");
const { User } = require("../models/user");
const generateAuthToken = require("../utils/genAuthToken");
const router = express.Router();

router.post("/", async(req, res) => {

    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(), //using a chain of methods with JOI
        email: Joi.string().min(3).max(200).required().email(), //.email validates that this is an email we asre getting
        password: Joi.string().min(6).max(200).required(),
    }); //validating data

    const {error} = schema.validate(req.body); //validate is a method which will compare this schema to request body
    //we created essentially an object error , which if true displays an error message

    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email}); //async action - async allows program to run a function without freezing entire program
                                                            //
    if(user) return res.status(400).send("User already exist..."); //checking if an email/user already exists. ^

    user = new User({ //dont need to be "const user = "because of
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }) 

    const salt = await bcrypt.genSalt(10) //async action, geenrate salt idk...
    user.password = await bcrypt.hash(user.password, salt) //what is the second parameter, idk but this line returns a hashed password

    user = await user.save() //save the user to database

    //generate a jsonwebtoken elsewhere
    const token = generateAuthToken(user) 

    res.send(token) //senidng this to frontend

    //This route checks if user exists, if it doesnt we pass a new object "user" making use of the model, it will hash password then generate a new user in the database
    //Generate token and send to UI / client

}); //default path, second argument helps handle requests

module.exports = router