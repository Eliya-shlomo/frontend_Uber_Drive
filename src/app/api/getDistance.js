import axios from 'axios';
import { config } from 'dotenv';
config(); 
const apiKey = process.env.API_KEY;



export async function getDistance(origin, destination) {
    try {
        const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destination}&origins=${origin}&key=${apiKey}`;

        const response = await axios.get(apiUrl);

        // Log the response data for debugging
        console.log("API Response:", response.data);

        // Check if distance data exists before accessing properties
        if (response.data.rows && response.data.rows[0] && response.data.rows[0].elements && response.data.rows[0].elements[0].distance) {
            return (response.data.rows[0].elements[0].distance.value / 10000000);
        } else {
            console.error("Distance information missing in response.");
            return null; // Or provide a default value here
        }
    } catch (error) {
        console.error(`Error calculating distance:`, error);
        return null;
    }
}

export default getDistance;
