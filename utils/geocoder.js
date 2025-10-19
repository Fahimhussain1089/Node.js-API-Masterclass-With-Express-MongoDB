

const NodeGeocoder = require('node-geocoder');
const options = {
    // provider: 'mapquest',
    // apiKey: process.env.GEOCODER_API_KEY,
    // formatter: null
    provider: 'openstreetmap'  
    
};
const geocoder = NodeGeocoder(options);

module.exports = geocoder;
