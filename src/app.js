require("dotenv").config();
const express = require('express');
const app = express();
const connectDB = require("./config/database");
const axios = require('axios');
const cors = require('cors');
const Restaurant = require('./models/Restaurant');
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.get("/data", async (req, res) => {
    try {
        const result = await Restaurant.find();
        console.log(result);
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

app.post('/api/route', async (req, res) => {
    const { origin, destination } = req.body;

    // Log the request to verify its structure
    console.log('Origin:', origin);
    console.log('Destination:', destination);

    if (!origin || !destination || !origin.lat || !origin.lng || !destination.lat || !destination.lng) {
        return res.status(400).json({ error: 'Invalid request format. LatLng data is required.' });
    }
    console.log("2nd phase")
    try {
        const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY; // Your Google Maps API key
        const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${googleMapsApiKey}`;

        const response = await axios.get(directionsUrl);
        //console.log("3rd phase")
        if (response.data.status === 'OK') {
            res.json(response.data);
            //console.log("4th phase" + response.data)
        } else {
            res.status(400).json({ error: 'Error fetching directions from Google Maps API', details: response.data.error_message });
            //console.log("5th phase")
        }
    } catch (error) {
        //console.log("6th phase")
        console.error('Error in route API:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

connectDB().then(() => {
    console.log("Database connection established...");
    app.listen(PORT, () => {
        console.log("Server is running...");
    })
    console.log("!Shree Ganesha!")
}).catch((err) => {
    console.log("Database couldn't be connected!!");
})