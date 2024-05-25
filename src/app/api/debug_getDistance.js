import getDistance from './getDistance.js';

// Sample origin and destination
const origin = 'tel aviv';
const destination = 'natanya';

// Call the getDistance function with sample origin and destination
getDistance(origin, destination)
  .then(distance => {
    console.log('Distance:', distance);
  })
  .catch(error => {
    console.error('Error:', error);
  });