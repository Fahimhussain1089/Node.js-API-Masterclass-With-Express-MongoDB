// Mount file routes file 
const path = require('path');
const express = require('express');
const dotenv  = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const fileUpload = require('express-fileupload');
const errorHandler = require('./middleware/error');
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

//------
dotenv.config({ path: './config/config.env' });
//------

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());


//++++++++++++++++++

// app.use(logger);
//this is dev login middleware ;
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));

}
//File upload
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));


//+++++++++++++++++++

// Mount routers
app.use('/api/v1/bootcamps', bootcamps); 
app.use('/api/v1/courses', courses);


app.use(errorHandler);

//-------------Testing server ----------------
// Load env vars first
require('dotenv').config({ path: './config/config.env' });

// Debug: Check if environment variables are loaded
console.log('GEOCODER_API_KEY:', process.env.GEOCODER_API_KEY ? 'Loaded' : 'NOT LOADED');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Loaded' : 'NOT LOADED');





const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});