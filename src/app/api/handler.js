import axios from 'axios';
import { config } from 'dotenv';
config();
import express from 'express';

const app = express();
const port = 3000;

app.get('/distance', async (req, res) => {
  const { destination, origin } = req.query;

  if (!origin || !destination) {
    return res.status(400).json({ error: 'Missing origin or destination' });
  }

  try {
    const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destination}&origins=${origin}&key=AIzaSyDz1TeVVi6-DGDXEJU2hq3QDZhAZnzDDdM`;
  
    const response = await axios.get(apiUrl);

    // Log the entire API response
    console.log("API Response:", response.data);

    // Check if distance data exists before accessing properties
    if (response.data.rows && response.data.rows[0] && response.data.rows[0].elements && response.data.rows[0].elements[0].distance) {
      const distance =  response.data.rows[0].elements[0].distance.value / 1000; // Distance in km
      return distance;
    } else {
      console.error("Distance information missing in response.");
      return res.status(500).json({ error: 'Distance information missing in response.' });
    }
  } catch (error) {
    console.error(`Error calculating distance:`, error);
    return res.status(500).json({ error: `Error calculating distance: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
