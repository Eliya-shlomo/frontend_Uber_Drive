import axios from 'axios';
import { config } from 'dotenv';
config();
const apikey = process.env.API_KEY;

export async function getDistance(origin, destination) {
    try {
        const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destination}&origins=${origin}&key=${apikey}`;

        const response = await axios.get(apiUrl);

        console.log("API Response:", response.data);

        if (response.data.rows && response.data.rows[0] && response.data.rows[0].elements && response.data.rows[0].elements[0].distance) {
            return response.data.rows[0].elements[0].distance.value / 1000; // Convert meters to kilometers
        } else {
            console.error("Distance information missing in response.");
            return null; 
        }
    } catch (error) {
        console.error("Error calculating distance:", error);
        return null;
    }
}

export default async function handler(req, res) {
    const { origin, destination } = req.query;

    if (!origin || !destination) {
        return res.status(400).json({ error: 'Missing origin or destination' });
    }

    const distance = await getDistance(origin, destination);

    if (distance !== null) {
        return res.status(200).json({ distance });
    } else {
        return res.status(500).json({ error: 'Error calculating distance' });
    }
}
