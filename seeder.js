const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const Bootcamp = require('./models/Bootcamp');
const dotenv = require('dotenv');
const geocoder = require('./utils/geocoder'); // Add this
const Course = require('./models/Course');




// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to DB//
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//     useFindAndModify: false
// });
mongoose.connect(process.env.MONGO_URI);



// Read JSON files
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);


//____________________Start Geocoding____________________

// Import into DB
// const importData = async () => {
//     try {
//         await Bootcamp.create(bootcamps);
//         console.log('Data Imported...'.green.inverse);
//         process.exit();
//     }
//     catch (err) {
//         console.error(err);
//     }
// }
//____________________Start Geocoding____________________

// Import into DB with geocoding
// const importData = async () => {
//     try {
//         // Delete existing data first
//         await Bootcamp.deleteMany();
        
//         // Geocode each bootcamp and create individually
//         for (let bootcampData of bootcamps) {
//             // Geocode the address
//             const loc = await geocoder.geocode(bootcampData.address);
            
//             // Create bootcamp with location data
//             await Bootcamp.create({
//                 ...bootcampData,
//                 location: {
//                     type: 'Point',
//                     coordinates: [loc[0].longitude, loc[0].latitude],
//                     formattedAddress: loc[0].formattedAddress,
//                     street: loc[0].streetName,
//                     city: loc[0].city,
//                     state: loc[0].stateCode,
//                     zipcode: loc[0].zipcode,
//                     country: loc[0].countryCode
//                 }
//             });
//         }
        
//         console.log('Data Imported with Geocoding...'.green.inverse);
//         process.exit();
//     } catch (err) {
//         console.error('Import Error:', err);
//         process.exit(1);
//     }
// };
// Import into DB with geocoding - FIXED VERSION
// const importData = async () => {
//     try {
//         // Delete existing data first
//         await Bootcamp.deleteMany();
//         await course.deleteMany();

//         console.log('Old data deleted...');
        
//         let importedCount = 0;
        
//         // Geocode each bootcamp and create individually
//         for (let i = 0; i < bootcamps.length; i++) {
//             try {
//                 const bootcampData = bootcamps[i];
//                 console.log(`Geocoding: ${bootcampData.name} - ${bootcampData.address}`);
                
//                 // Geocode the address
//                 const loc = await geocoder.geocode(bootcampData.address);
                
//                 if (!loc || loc.length === 0) {
//                     console.log(`❌ Could not geocode: ${bootcampData.address}`);
//                     continue;
//                 }
                
//                 console.log(`✅ Geocoded to: ${loc[0].latitude}, ${loc[0].longitude}`);
            
//                 // In your seeder.js - fix the location mapping
//                     await Bootcamp.create({
//                         ...bootcampData,
//                         location: {
//                             type: 'Point',
//                             coordinates: [loc[0].longitude, loc[0].latitude],
//                             formattedAddress: loc[0].formattedAddress,
//                             street: loc[0].streetName,
//                             city: loc[0].city,
//                             state: loc[0].administrativeLevels && loc[0].administrativeLevels.level1long 
//                                 ? loc[0].administrativeLevels.level1long 
//                                 : loc[0].state || loc[0].region,
//                             zipcode: loc[0].zipcode,
//                             country: loc[0].countryCode
//                         }
//                     });
//                     await Bootcamp.create({
//                         ...bootcampData,
//                         location: {
//                             type: 'Point',
//                             coordinates: [loc[0].longitude, loc[0].latitude],
//                             formattedAddress: loc[0].formattedAddress,
//                             street: loc[0].streetName,
//                             city: loc[0].city,
//                             state: loc[0].state,  // Use the corrected state field
//                             zipcode: loc[0].zipcode,
//                             country: loc[0].countryCode
//                         }
//                     });
                

                
//                 importedCount++;
//                 console.log(`✅ Imported: ${bootcampData.name}`);
                
//             } catch (error) {
//                 console.log(`❌ Failed to import ${bootcamps[i].name}:`, error.message);
//             }
//         }
        
//         console.log(`🎉 Successfully imported ${importedCount} out of ${bootcamps.length} bootcamps`.green.inverse);
//         process.exit();
//     } catch (err) {
//         console.error('Import Error:', err);
//         process.exit(1);
//     }
// };


// Import into DB with geocoding - FIXED VERSION
// const importData = async () => {
//     try {
//         // Delete existing data first
//         await Bootcamp.deleteMany();
//         await Course.deleteMany(); // Fixed: Use Course instead of course
//         console.log('🗑️ Old data deleted...'.red);
        
//         let bootcampImportedCount = 0;
//         let courseImportedCount = 0;
        
//         // 1. FIRST IMPORT BOOTCAMPS
//         console.log('🚀 Importing bootcamps...'.blue);
//         for (let i = 0; i < bootcamps.length; i++) {
//             try {
//                 const bootcampData = bootcamps[i];
//                 console.log(`📍 Geocoding: ${bootcampData.name} - ${bootcampData.address}`);
                
//                 // Geocode the address
//                 const loc = await geocoder.geocode(bootcampData.address);
                
//                 if (!loc || loc.length === 0) {
//                     console.log(`❌ Could not geocode: ${bootcampData.address}`);
//                     continue;
//                 }
                
//                 console.log(`✅ Geocoded to: ${loc[0].latitude}, ${loc[0].longitude}`);
                
//                 // Remove the fixed _id to let MongoDB generate a new one
//                 const { _id, ...bootcampWithoutId } = bootcampData;
                
//                 // Create bootcamp with location data
//                 await Bootcamp.create({
//                     ...bootcampWithoutId, // Use spread without _id
//                     location: {
//                         type: 'Point',
//                         coordinates: [loc[0].longitude, loc[0].latitude],
//                         formattedAddress: loc[0].formattedAddress,
//                         street: loc[0].streetName,
//                         city: loc[0].city,
//                         state: loc[0].administrativeLevels?.level1long || loc[0].state || loc[0].region,
//                         zipcode: loc[0].zipcode,
//                         country: loc[0].countryCode
//                     }
//                 });
                
//                 bootcampImportedCount++;
//                 console.log(`✅ Imported: ${bootcampData.name}`);
                
//             } catch (error) {
//                 console.log(`❌ Failed to import ${bootcamps[i].name}:`, error.message);
//             }
//         }
        
//         // 2. THEN IMPORT COURSES
//         console.log('\n📚 Importing courses...'.blue);
//         for (let i = 0; i < courses.length; i++) {
//             try {
//                 const courseData = courses[i];
                
//                 // Remove the fixed _id to let MongoDB generate a new one
//                 const { _id, ...courseWithoutId } = courseData;
                
//                 await Course.create(courseWithoutId);
//                 courseImportedCount++;
//                 console.log(`✅ Imported course: ${courseData.title}`);
                
//             } catch (error) {
//                 console.log(`❌ Failed to import course ${courses[i].title}:`, error.message);
//             }
//         }
        
//         console.log(`\n🎉 SUCCESS SUMMARY:`.green.bold);
//         console.log(`✅ Bootcamps: ${bootcampImportedCount} out of ${bootcamps.length}`.green);
//         console.log(`✅ Courses: ${courseImportedCount} out of ${courses.length}`.green);
        
//         process.exit();
//     } catch (err) {
//         console.error('❌ Import Error:'.red, err);
//         process.exit(1);
//     }
// };

// Import into DB with geocoding - FIXED VERSION
const importData = async () => {
    try {
        // Delete existing data first
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        console.log('🗑️ Old data deleted...'.red);
        
        let bootcampImportedCount = 0;
        let courseImportedCount = 0;
        
        // Store mapping of old bootcamp IDs to new bootcamp IDs
        const bootcampIdMap = {};
        
        // 1. FIRST IMPORT BOOTCAMPS
        console.log('🚀 Importing bootcamps...'.blue);
        for (let i = 0; i < bootcamps.length; i++) {
            try {
                const bootcampData = bootcamps[i];
                const oldBootcampId = bootcampData._id; // Store the old ID
                
                console.log(`📍 Geocoding: ${bootcampData.name} - ${bootcampData.address}`);
                
                // Geocode the address
                const loc = await geocoder.geocode(bootcampData.address);
                
                if (!loc || loc.length === 0) {
                    console.log(`❌ Could not geocode: ${bootcampData.address}`);
                    continue;
                }
                
                console.log(`✅ Geocoded to: ${loc[0].latitude}, ${loc[0].longitude}`);
                
                // Remove the fixed _id to let MongoDB generate a new one
                const { _id, ...bootcampWithoutId } = bootcampData;
                
                // Create bootcamp with location data
                const newBootcamp = await Bootcamp.create({
                    ...bootcampWithoutId,
                    location: {
                        type: 'Point',
                        coordinates: [loc[0].longitude, loc[0].latitude],
                        formattedAddress: loc[0].formattedAddress,
                        street: loc[0].streetName,
                        city: loc[0].city,
                        state: loc[0].administrativeLevels?.level1long || loc[0].state || loc[0].region,
                        zipcode: loc[0].zipcode,
                        country: loc[0].countryCode
                    }
                });
                
                // Store mapping: old ID -> new ID
                bootcampIdMap[oldBootcampId] = newBootcamp._id;
                
                bootcampImportedCount++;
                console.log(`✅ Imported: ${bootcampData.name} (Old ID: ${oldBootcampId} -> New ID: ${newBootcamp._id})`);
                
            } catch (error) {
                console.log(`❌ Failed to import ${bootcamps[i].name}:`, error.message);
            }
        }
        
        // 2. THEN IMPORT COURSES WITH UPDATED BOOTCAMP IDs
        console.log('\n📚 Importing courses...'.blue);
        for (let i = 0; i < courses.length; i++) {
            try {
                const courseData = courses[i];
                
                // Get the new bootcamp ID from our mapping
                const newBootcampId = bootcampIdMap[courseData.bootcamp];
                
                if (!newBootcampId) {
                    console.log(`❌ No bootcamp found for course: ${courseData.title}`);
                    continue;
                }
                
                // Remove the fixed _id and update bootcamp reference
                const { _id, ...courseWithoutId } = courseData;
                
                await Course.create({
                    ...courseWithoutId,
                    bootcamp: newBootcampId // Use the new bootcamp ID
                });
                
                courseImportedCount++;
                console.log(`✅ Imported course: ${courseData.title} (Bootcamp: ${newBootcampId})`);
                
            } catch (error) {
                console.log(`❌ Failed to import course ${courses[i].title}:`, error.message);
            }
        }
        
        console.log(`\n🎉 SUCCESS SUMMARY:`.green.bold);
        console.log(`✅ Bootcamps: ${bootcampImportedCount} out of ${bootcamps.length}`.green);
        console.log(`✅ Courses: ${courseImportedCount} out of ${courses.length}`.green);
        
        // Print bootcamp IDs for testing
        console.log(`\n🔍 Bootcamp IDs for testing:`.blue.bold);
        const allBootcamps = await Bootcamp.find().select('name _id');
        allBootcamps.forEach(bootcamp => {
            console.log(`   ${bootcamp.name}: ${bootcamp._id}`.cyan);
        });
        
        process.exit();
    } catch (err) {
        console.error('❌ Import Error:'.red, err);
        process.exit(1);
    }
};

//__________________End Geocoding____________________
// Delete data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany(); // Fixed: Use Course instead of course

        console.log('Data Destroyed...'.red.inverse);
        process.exit();
    }catch (err) {
        console.error(err);
    }
}

if (process.argv[2] === '-i') {//-i import
    importData();
}
else if (process.argv[2] === '-d') { //-d 
    deleteData();
}else {
    console.log('Please use -i to import or -d to delete data'.yellow.inverse);
    process.exit(1);
}
//
