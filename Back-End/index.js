const express = require("express"); //how we import express using node
const cors = require("cors");
const mongoose = require("mongoose"); //will allow us to connect to our MongoDB database
const register = require("./routes/register"); //from register.js
const login = require("./routes/login");
const stripe = require("./routes/stripe");
const productsRoute = require("./routes/products");

const products = require("./products");

const app = express(); //now this app will be an object and contain various methods

require("dotenv").config();

app.use(express.json()); //we are configuring a middleware ?? function
app.use(cors()); //Allow us to access node js api from react application

app.use("/api/register", register); //ANYTIME you see app.USE , know we are making use of middleware
app.use("/api/login", login);
app.use("/api/stripe", stripe);
app.use("/api/products", productsRoute);

app.get("/", (req, res) =>{
    res.send("Welcome to our Online Shop API...");
});
app.get("/products", (req, res) =>{
    res.send(products);
});

const port = process.env.PORT || 5000;
const uri = process.env.DB_URI; //.env

app.listen(port, console.log(`Server Running on port ${port}`)); // ` ` Allows for easy string concat.

//code for connecting mongoDB
mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connection successful..."))
.catch((err) => console.log("MongoDB connection failed", err.message)); //Authentication failed

//command for backedn running : npx nodemon index.js