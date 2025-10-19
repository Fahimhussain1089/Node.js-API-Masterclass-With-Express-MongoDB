const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');



//@desc    Get all bootcamps
//@route   GET /api/v1/bootcamps
//@access  Public

exports.getBootcamps =asyncHandler(async(req, res,next) => {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({success: true ,count:bootcamps.lenght , data: bootcamps});
    
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
