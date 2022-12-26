const dotenv = require("dotenv");
const cloudinaryModule = require("cloudinary");

dotenv.config();
const cloudinary = cloudinaryModule.v2;

cloudinary.config({ //we need to get these from the cloudinary platform.
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, 
})

module.exports = cloudinary;