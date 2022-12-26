const bcrypt = require("bcrypt");
const express = require("express");
const Joi = require("joi");
const { User } = require("../models/user");
const generateAuthToken = require("../utils/genAuthToken");

const router = express.Router();

router.post("/", async(req, res) => {

    const schema = Joi.object({
        //dont need name field to login
        email: Joi.string().min(3).max(200).required().email(), //.email validates that this is an email we asre getting
        password: Joi.string().min(6).max(200).required(),
    }); //validating data

    const {error} = schema.validate(req.body); //validate is a method which will compare this schema to request body
    //we created essentially an object error , which if true displays an error message

    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email}); //async action - async allows program to run a function without freezing entire program
                                                            //fetches the user
    if(!user) return res.status(400).send("User does not exist..."); //checking if an email/user DOESNT exists. ^

    const isValid = await bcrypt.compare(req.body.password, user.password); // we already fetched user above ^, comparing databse password with input password

    if(!isValid) return res.status(400).send("Invalid email or password...");
    
    const token = generateAuthToken(user); 

    res.send(token);

});

module.exports = router;

