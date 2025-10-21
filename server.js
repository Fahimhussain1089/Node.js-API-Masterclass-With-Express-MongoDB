// Mount file routes file 
const dotenv  = require('dotenv');
const path = require('path');
const express = require('express');

const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
// const mongoSanitize = require('express-mongo-sanitize');
// const helmet = require('helmet');
// const xss = require('xss-clean');
// const  rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const errorHandler = require('./middleware/error');
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users= require('./routes/users');
const reviews = require('./routes/reviews');
const { default: rateLimit } = require('express-rate-limit');


//------
dotenv.config({ path: './config/config.env' });
//------

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
// Cookie parser
app.use(cookieParser());


//++++++++++++++++++

// app.use(logger);
//this is dev login middleware ;
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));

}

// Sanitize data
// app.use(mongoSanitize());
// Set security headers
// app.use(helmet());

//___________replacement of mongoSanitize Start

//prevent NoSQL injection attacks
// app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());


// Custom NoSQL injection protection (use this instead)
app.use((req, res, next) => {
  // Simple NoSQL injection protection
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        if (key.startsWith('$') || key.includes('.')) {
          delete obj[key];
        } else if (typeof obj[key] === 'object') {
          sanitize(obj[key]);
        }
      });
    }
  };

  ['body', 'query', 'params'].forEach(key => {
    if (req[key]) {
      sanitize(req[key]);
    }
  });

  next();
});
//_________________replacement of mongoSanitize End

//File upload
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));


//+++++++++++++++++++

// Mount routers
app.use('/api/v1/bootcamps', bootcamps); 
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);


app.use(errorHandler);

//-------------Testing server ----------------
// Load env vars first
require('dotenv').config({ path: './config/config.env' });

// Debug: Check if environment variables are loaded
console.log('GEOCODER_API_KEY:', process.env.GEOCODER_API_KEY ? 'Loaded' : 'NOT LOADED');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Loaded' : 'NOT LOADED');
// Debug: Check if JWT environment variables are loaded
console.log('GEOCODER_API_KEY:', process.env.GEOCODER_API_KEY ? 'Loaded' : 'NOT LOADED');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Loaded' : 'NOT LOADED');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'NOT LOADED'); // Add this line
console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE ? 'Loaded' : 'NOT LOADED'); // Add this line

console.log('✅ Environment variables loaded:');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER ? '***' : 'undefined');
// ... rest of your server code







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