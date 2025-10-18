
const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const colors   = require('colors');

// Load env vars
const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
}
module.exports = connectDB;