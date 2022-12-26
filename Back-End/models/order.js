const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    customerId: {type: String},
    paymentId: {type: String},
    products: [
        {
            id: { type: String },
            name: { type: String },
            brand: { type: String },
            desc: { type: String },
            price: { type: String },
            image: { type: String },
            cartQuanity: {type: Number},
        },
    ],
    subtotal: {type: Number, required: true},
    total: {type: Number, required: true},
    shipping: {type: Object, required: true},
    deliver_status: {type: String, default: "pending"},
    payment_status: {type: String, required: true},
},
{timestamps: true});

const Order = mongoose.model("Order", orderSchema);

exports.Order = Order;