import axios from 'axios';
import { config } from 'dotenv';
config();


const APIKEY='AIzaSyBMLodS1UobbB15ZExGXoHosoGhGvDTD5I';

export default async function handler(req, res) {
    const { origin, destination } = req.query;

    if (!origin || !destination) {
        return res.status(400).json({ error: 'Missing origin or destination' });
    }

    try {
        const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destination}&origins=${origin}&key=${APIKEY}`;
        const response = await axios.get(apiUrl);

        console.log("API Response:", response.data);

        if (response.data.rows &&
            response.data.rows[0] &&
            response.data.rows[0].elements &&
            response.data.rows[0].elements[0].distance) {
            const distance = response.data.rows[0].elements[0].distance.value / 1000; // Convert meters to kilometers
            return res.json({ distance });
        } else {
            console.error("Distance information missing in response.");
            return res.status(500).json({ error: 'Distance information missing in response.' });
        }
    } catch (error) {
        console.error("Error calculating distance:", error);
        return res.status(500).json({ error: `Error calculating distance: ${error.message}` });
    }
}
