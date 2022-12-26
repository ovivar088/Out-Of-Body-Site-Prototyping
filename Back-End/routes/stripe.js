const express =  require('express');
const Stripe = require("stripe");
//const Order from "../models/order"
const { Order } = require("../models/order");


require("dotenv").config();
const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

router.post('/create-checkout-session', async (req, res)=> {

    const customer = await stripe.customers.create({
        metadata:{
            userId: req.body.userId,
            cart: JSON.stringify(req.body.cartItems),
        },
    });

    const line_items = req.body.cartItems.map(item => {
        return {
            price_data: {
                currency:'usd',
                product_data: {
                    name: item.name,
                    images: [item.image],
                    description: item.desc,
                    metadata: {
                        id: item.id
                    } 
                },
                unit_amount: item.price * 100, //is in cents so * 100
            },
            quantity: item.cartQuantity,
        };
    })

    const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    shipping_address_collection: {allowed_countries: ['US', 'CA'],},
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 0,
            currency: 'usd',
          },
          display_name: 'Free shipping',
          // Delivers between 5-7 business days
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 5,
            },
            maximum: {
              unit: 'business_day',
              value: 7,
            },
          }
        }
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 1500,
            currency: 'usd',
          },
          display_name: 'Next day air',
          // Delivers in exactly 1 business day
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 1,
            },
            maximum: {
              unit: 'business_day',
              value: 1,
            },
          }
        }
      },
    ],
    phone_number_collection: {
        enabled: true,
    },
    customer: customer.id,
    line_items, 
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.send({url: session.url});
});

//Create Order
const createOrder = async(customer,data) => {
    const Items = JSON.parse(customer.metadata.cart);

    const newOrder = new Order({
        userId: customer.metadata.userId,
        customerId:  data.customer, 
        paymentIntentId: data.payment_intent,
        products:  Items,
        subtotal: data.amount_subtotal,
        total: data.amount_total,
        shipping: data.customer_details,
        payment_status: data.payment_status,
    });

    try{
        const savedOrder = await newOrder.save();
        console.log("Processed Order:", savedOrder);
        //email

    }catch(err){
        console.log(err)
    }
}


// Stripe Webhook
// This is your Stripe CLI webhook secret for testing your endpoint locally.
let endpointSecret ;
//endpointSecret = "whsec_e13dd7bc21900b6ec031540d686325dd76574c2abbcd4fd794714143908a2ee1";

router.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const payload = res.body;
  const payloadString = JSON.stringify(payload, null, 2); //we stringifed the
  const header = stripe.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret: "whsec_e13dd7bc21900b6ec031540d686325dd76574c2abbcd4fd794714143908a2ee1",
  });
  
  /*
  try {
    event = stripe.webhooks.constructEvent(payloadString, header, "whsec_e13dd7bc21900b6ec031540d686325dd76574c2abbcd4fd794714143908a2ee1");
    console.log(`Webhook Verified: `, event); //Unexpected token in JSON at position 0
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    console.log("The issue is right underneath me:")
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  data = event.data.object;
  eventType = req.body.type;
  */
  let data;
  let eventType;

  if(endpointSecret){
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log("Webhook verified, shit valid b.")
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`)
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    data = event.data.object;
    eventType = event.type;
  }
  else{
    data = req.body.data.object;
    eventType = req.body.type;
  }

  // Handle the event
  if(eventType === "checkout.session.completed"){
    stripe.customers.retrieve(data.customer).then((customer) => {
        createOrder(customer, data);
        //email
    })
    .catch(err => console.log(err.message));
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send().end();
}); 

module.exports = router;