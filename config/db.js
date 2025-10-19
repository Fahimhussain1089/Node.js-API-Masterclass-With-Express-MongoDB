
const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const colors   = require('colors');

// Load env vars
const connectDB = async () => {
    // const conn = await mongoose.connect(process.env.MONGO_URI, {
    //     useNewUrlParser: true,
    //     // useCreateIndex: true,
    //     // useFindAndModify: false,
    //     useUnifiedTopology: true,
    // });

    // console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
     try {
        const conn = await mongoose.connect(process.env.MONGO_URI,{
             useNewUrlParser: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
            useUnifiedTopology: true,

        });
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
}
module.exports = connectDB;