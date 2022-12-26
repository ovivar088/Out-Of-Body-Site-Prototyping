const express = require("express");

const { Product } = require("../models/product");
const cloudinary = require("../utils/cloudinary");

const router = express.Router(); //handles requests and responses

//CREATE
router.post("/", async(req, res) => {
    const { name, desc, price, image } = req.body; //REQ BODY
  
    try {
      if (image) {
        const uploadedResponse = await cloudinary.uploader.upload(image, {
          upload_preset: "OnlineShop",
        });
  
        if (uploadedResponse) {
          console.log("Product image uploaded...");
          const product = new Product({
            name,
            desc,
            price,
            image: uploadedResponse,
          });
  
          const savedProduct = await product.save();
          res.status(200).send(savedProduct);
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
});



router.get("/", async (req,res) => {
    try{
        const products = await Product.find();
        res.status(200).send(products);
    }
    catch(error){
        console.log(error);
        res.status(500).send(error);
    }
})


module.exports = router;