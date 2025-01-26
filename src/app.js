require("dotenv").config();
const express = require('express');
const app = express();
const connectDB = require("./config/database");
//const axios = require('axios');
const cors = require('cors');
const Restaurant = require('./models/Restaurant');
const PaymentsLog = require('./models/PaymentsLog');
const Location = require('./models/LocationSchema');
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.get("/data", async (req, res) => {
    try {
        const result = await Restaurant.find();
        //console.log(result);
        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.post("/restaurants", async (req, res) => {
    try {
        const {
            rt_id,
            rt_name,
            cloudinary_image_id,
            locality,
            area_name,
            cost_for_two,
            avg_rating,
            parent_id,
            total_ratings,
            is_open,
            type,
            next_close_time,
            display_type,
            cuisines
        } = req.body;

        const newRestaurant = new Restaurant({
            rt_id,
            rt_name,
            cloudinary_image_id,
            locality,
            area_name,
            cost_for_two,
            avg_rating,
            parent_id,
            total_ratings,
            is_open,
            type,
            next_close_time,
            display_type,
            cuisines
        });

        await newRestaurant.save();
        res.status(201).json({ message: "Restaurant added successfully!", newRestaurant });
    } catch (err) {
        console.error("Error adding restaurant:", err.message);
        res.status(500).send("Server Error");
    }
});

app.post('/paymentdetails', async (req, res) => {
    try {
        const { order_id, transaction_id, name, amount, userId, type, status } = req.body;

        if (!order_id || !transaction_id || !name || !amount || !userId || !type) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const payment = new PaymentsLog({
            order_id,
            transaction_id,
            user_name: name,
            userId,
            amount,
            type,
            status: status || "order_placed",
        });

        const savedPayment = await payment.save();

        res.status(201).json({
            message: "Payment details saved successfully",
            payment: savedPayment,
        });
    } catch (err) {
        if (err.code === 11000 && err.keyPattern.transaction_id) {
            return res.status(400).json({ error: "Transaction ID must be unique" });
        }
        console.error("Error saving payment details:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/orders', async (req, res) => {
    try {
        const { status,userId } = req.query;
        console.log(req.query)
        let result;

        if (status) {
            result = await PaymentsLog.find({ status });
        } 
        else if (userId){
            result = await PaymentsLog.find({ userId });
        }
        else {
            result = await PaymentsLog.find();
        }

        // Send a structured response
        res.json({
            success: true,
            data: result,
        });
    } catch (err) {
        console.error("Error fetching orders:", err.message);

        // Send an error response with additional info
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
});

app.get('/userorders', async (req, res) => {
    const { user_id, order_type } = req.query;
    try {
        if (!user_id || !order_type) {
            return res.status(400).send("Missing user_id or order_type");
        }

        const userOrders = await PaymentLogs.find({ user_id, order_type });

        if (userOrders.length === 0) {
            return res.status(404).send("No orders found for the given user and order type");
        }

        res.status(200).json({
            success: true,
            message: "Orders retrieved successfully",
            orders: userOrders,
        });
    } catch (err) {
        console.error("Error fetching user orders:", err);
        res.status(500).send("Error fetching data");
    }
});

app.patch('/orderstatus', async (req, res) => {
    const { order_id,status } = req.body;
    try {
        if (!order_id) {
            return res.status(400).json({ error: "Order ID is required" });
        }
        
        const updatedPayment = await PaymentsLog.findOneAndUpdate(
            { order_id: order_id }, 
            { status: status },  
            { new: true } 
        );

        if (!updatedPayment) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json({
            message: "Order status updated successfully",
            payment: updatedPayment,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.get('/ordertrack', async (req, res) => {
    try{
        const order_id = req.query.order_id;
        if(!order_id) return res.status(400).send("Missing order_id");

        const details = await Location.find({ order_id });
        console.log(details)
        if (details.length === 0) {
            return res.status(404).send("No orders found for the given order type");
        }

        res.status(200).json({
            success: true,
            message: "Orders retrieved successfully",
            order: details,
        });
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.post('/ordertrack', async(req, res) => {
    try{
        const { order_id,user_location,userId } = req.body;
        if(!order_id || !user_location || !userId){
            return res.status(400).json({ error: "Order ID is required" });
        }

        const newOrder = new Location({
            order_id,
            userId,
            user_location
        });

        await newOrder.save();
        res.status(201).json({ message: "Success!" });
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.patch('/ordertrack', async(req, res) => {
    try{
        const { order_id, driver_location } = req.body;
        
        if(!order_id || !driver_location){
            return res.status(400).json({ error: "Order ID is required" });
        }

        const updatedOrder = await Location.findOneAndUpdate(
            { order_id: order_id },
            { driver_location: driver_location },
            { new: true } 
        );
        
        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }
        
        res.status(200).json({
            message: "Order status updated successfully",
            order: updatedOrder,
        });
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

// app.post('/api/route', async (req, res) => {
//     const { origin, destination } = req.body;

//     // Log the request to verify its structure
//     console.log('Origin:', origin);
//     console.log('Destination:', destination);

//     if (!origin || !destination || !origin.lat || !origin.lng || !destination.lat || !destination.lng) {
//         return res.status(400).json({ error: 'Invalid request format. LatLng data is required.' });
//     }
//     console.log("2nd phase")
//     try {
//         const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY; // Your Google Maps API key
//         const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${googleMapsApiKey}`;

//         const response = await axios.get(directionsUrl);
//         //console.log("3rd phase")
//         if (response.data.status === 'OK') {
//             res.json(response.data);
//             //console.log("4th phase" + response.data)
//         } else {
//             res.status(400).json({ error: 'Error fetching directions from Google Maps API', details: response.data.error_message });
//             //console.log("5th phase")
//         }
//     } catch (error) {
//         //console.log("6th phase")
//         console.error('Error in route API:', error);
//         res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
// });

connectDB().then(() => {
    console.log("Database connection established...");
    app.listen(PORT, () => {
        console.log("Server is running...");
    })
    console.log("!Shree Ganesha!")
}).catch((err) => {
    console.log("Database couldn't be connected!!");
})