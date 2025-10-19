const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');



//@desc    Get all bootcamps
//@route   GET /api/v1/bootcamps
//@access  Public

// exports.getBootcamps =asyncHandler(async(req, res,next) => {
//     let query;
//     let queryStr = JSON.stringify(req.query);
//     queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

//     // console.log('apki location: ', req.query,"\n \n QueryString :",queryStr ,"\n\n");//apki location:  [Object: null prototype] { 'location.state': 'MA', housing: 'true' }
//     console.log(
//         'apki location: '.green.bold + 
//         JSON.stringify(req.query, null, 2).yellow + 
//         "\n \n QueryString :".green.bold + 
//         queryStr.yellow + 
//         "\n\n"
//     );

//     query = Bootcamp.find(JSON.parse(queryStr))

//     const bootcamps = await query;
//     // Bootcamp.find(
        
//     // //    req.query
//     // );
//     res.status(200).json({success: true ,count:bootcamps.lenght , data: bootcamps});
    
// });

//@desc    Get all bootcamps
//@route   GET /api/v1/bootcamps
//@access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude from filtering (used for other operations)
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // MANUAL PARSING FOR SQUARE BRACKET NOTATION (for filtering)
    let queryObj = {};
    
    for (let key in reqQuery) {
        // Check if key contains square brackets (e.g., "averageCost[lt]")
        if (key.includes('[') && key.includes(']')) {
            const fieldName = key.split('[')[0]; // "averageCost"
            const operator = key.split('[')[1].split(']')[0]; // "lt"
            const value = reqQuery[key];
            
            // Initialize field if it doesn't exist
            if (!queryObj[fieldName]) {
                queryObj[fieldName] = {};
            }
            
            // Convert value to number if it's a numeric string
            const numericValue = isNaN(value) ? value : Number(value);
            queryObj[fieldName][`$${operator}`] = numericValue;
        } else {
            // Regular field (e.g., "housing=true")
            queryObj[key] = isNaN(reqQuery[key]) ? reqQuery[key] : Number(reqQuery[key]);
        }
    }
    
    console.log(
        '📍 Query Parameters:'.green.bold + 
        JSON.stringify(req.query, null, 2).yellow + 
        "\n \n 🔍 Parsed Query Object:".green.bold + 
        JSON.stringify(queryObj, null, 2).cyan +
        "\n \n 🎯 Select Fields:".green.bold + 
        (req.query.select || 'all fields').magenta +
        "\n \n 📊 Pagination:".green.bold + 
        `page: ${req.query.page || 1}, limit: ${req.query.limit || 'none'}`.blue +
        "\n\n"
    );

    // Find bootcamps with the parsed query object (FILTERING)
    query = Bootcamp.find(queryObj).populate('courses');

    // SELECT FIELDS
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        console.log('🎯 Selecting fields:'.blue.bold, fields.blue);
        query = query.select(fields);
    }

    // SORT
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        console.log('📊 Sorting by:'.blue.bold, sortBy.blue);
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt'); // Default sort by newest first
    }

    // PAGINATION - IMPLEMENT THIS PART
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 0; // 0 means no limit
    const startIndex = (page - 1) * limit;
    
    if (limit > 0) {
        query = query.skip(startIndex).limit(limit);
        console.log('📄 Pagination applied:'.blue.bold, `skip: ${startIndex}, limit: ${limit}`.blue);
    }

    // EXECUTE QUERY
    const bootcamps = await query;
    
    // COUNT TOTAL DOCUMENTS (for pagination info)
    const total = await Bootcamp.countDocuments(queryObj);
    
    // PAGINATION RESULT
    const pagination = {};
    if (limit > 0) {
        if (startIndex + limit < total) {
            pagination.next = {
                page: page + 1,
                limit: limit
            };
        }
        
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit: limit
            };
        }
        
        pagination.totalPages = Math.ceil(total / limit);
        pagination.currentPage = page;
        pagination.total = total;
    }
    
    res.status(200).json({
        success: true,
        count: bootcamps.length, // This will now show the actual returned count
        pagination: Object.keys(pagination).length > 0 ? pagination : undefined,
        data: bootcamps
    });
});



//@desc    Get single bootcamps
//@route   GET /api/v1/bootcamps/:id
//@access  Public

exports.getBootcamp = asyncHandler(async (req, res,next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({success: true , data: bootcamp});
});

//@desc    create new   bootcamps
//@route   POST /api/v1/bootcamps
//@access  Private

exports.createBootcamp = asyncHandler(async(req, res,next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success:true,
        data:bootcamp
    });

});

//@desc    update  single bootcamps
//@route   put /api/v1/bootcamps/:id
//@access  Private

exports.updateBootcamp =asyncHandler( async (req, res,next) => {
    const bootcamp =await Bootcamp.findByIdAndUpdate(req.params.id
    ,req.body,{
        new:true,
        runValidators:true
    });
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({success:true ,data:bootcamp});
});

//@desc    delete  single bootcamps
//@route   delete /api/v1/bootcamps/:id
//@access  Private

exports.deleteBootcamp =asyncHandler( async (req, res,next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
      if(!bootcamp){
            // return res.status(400).json({success:false});
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }
        bootcamp.remove();
        
    res.status(200).json({success:true ,data:{}});
});

//@desc    GET BOOTCAMPS WITHIN A RADIOUS
//@route   GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access  Private

// exports.getBootcampsInRadius = asyncHandler( async (req, res,next) => {
//     const {zipcode , distance} = req.params;

//     //Get lat/lng from geocoder
//     const loc = await geocoder.geocode(zipcode);
//     const lat = loc[0].latitude;
//     const lng = loc[0].longitude;

//     // Calc radius using radians
//     // Divide distance by radius of Earth
//     // Earth Radius = 3,963 mi / 6,378 km
//     const radius = distance / 3963;

//     const bootcamps = await Bootcamp.find({
//         location: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } }
//     });

//     res.status(200).json({
//         success: true,
//         count: bootcamps.length,
//         data: bootcamps
//     });

// });
//----------------------------------Start----------------------------------
// Add this temporary route to check your bootcamp data
exports.getBootcampsDebug = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find();
    
    // Check location data for each bootcamp
    const bootcampsWithLocation = bootcamps.map(bootcamp => ({
        name: bootcamp.name,
        location: bootcamp.location,
        hasCoordinates: bootcamp.location && bootcamp.location.coordinates && bootcamp.location.coordinates.length === 2
    }));
    
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcampsWithLocation
    });
});
//@desc    GET BOOTCAMPS WITHIN A RADIUS (DEBUG VERSION)
//@route   GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access  Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    console.log('Geocoded location:', loc[0]); // Debug log
    
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Debug: Check coordinates
    console.log('Search center:', { lat, lng });
    console.log('Search distance:', distance, 'miles');

    // Calc radius using radians - FIXED CALCULATION
    // Earth Radius = 3,963 mi
    const radius = parseFloat(distance) / 3963;
    console.log('Radius in radians:', radius);

    // Debug: Check all bootcamps and their distances
    const allBootcamps = await Bootcamp.find();
    console.log('Total bootcamps in DB:', allBootcamps.length);
    
    allBootcamps.forEach(bootcamp => {
        if (bootcamp.location && bootcamp.location.coordinates) {
            const bootcampLng = bootcamp.location.coordinates[0];
            const bootcampLat = bootcamp.location.coordinates[1];
            
            // Calculate actual distance (rough estimate)
            const dLat = (bootcampLat - lat) * Math.PI / 180;
            const dLng = (bootcampLng - lng) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(lat * Math.PI / 180) * Math.cos(bootcampLat * Math.PI / 180) *
                      Math.sin(dLng/2) * Math.sin(dLng/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const actualDistance = 3963 * c;
            
            console.log(`Bootcamp: ${bootcamp.name}, Distance: ${actualDistance.toFixed(2)} miles`);
        }
    });

    const bootcamps = await Bootcamp.find({
        location: { 
            $geoWithin: { 
                $centerSphere: [ [ lng, lat ], radius ] 
            } 
        }
    });

    console.log('Found bootcamps in radius:', bootcamps.length); // Debug log

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});
//-- IGNORE ---
