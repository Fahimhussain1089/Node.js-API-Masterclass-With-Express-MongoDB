const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const Bootcamp = require('./models/Bootcamp');
const dotenv = require('dotenv');
const geocoder = require('./utils/geocoder'); // Add this
const Course = require('./models/Course');
const User = require('./models/User');
const Review = require('./models/Review');





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
const users = JSON.parse(
    fs
        .readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);
const reviews = JSON.parse(
    fs
        .readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
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
// const importData = async () => {
//     try {
//         // Delete existing data first
//         await Bootcamp.deleteMany();
//         await Course.deleteMany();
//         await User.deleteMany(); // Also clear users
//         await Review.deleteMany(); // Also clear reviews
//         console.log('🗑️ Old data deleted...'.red);
        
//         let bootcampImportedCount = 0;
//         let courseImportedCount = 0;
//         let userImportedCount = 0; // ← THIS WAS MISSING!

        
//         // Store mapping of old bootcamp IDs to new bootcamp IDs
//         const bootcampIdMap = {};


//         // 1. FIRST IMPORT USERS (This is what's missing!)
//         console.log('👤 Importing users...'.blue);
//         for (let i = 0; i < users.length; i++) {
//             try {
//                 const userData = users[i];
                
//                 // Remove the fixed _id to let MongoDB generate a new one
//                 const { _id, ...userWithoutId } = userData;
                
//                 await User.create(userWithoutId);
//                 userImportedCount++;
//                 console.log(`✅ Imported user: ${userData.name} (${userData.email})`);
                
//             } catch (error) {
//                 console.log(`❌ Failed to import user ${users[i].name}:`, error.message);
//             }
//         }
        
//         // 2. FIRST IMPORT BOOTCAMPS
//         console.log('🚀 Importing bootcamps...'.blue);
//         for (let i = 0; i < bootcamps.length; i++) {
//             try {
//                 const bootcampData = bootcamps[i];
//                 const oldBootcampId = bootcampData._id; // Store the old ID
                
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
//                 const newBootcamp = await Bootcamp.create({
//                     ...bootcampWithoutId,
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
                
//                 // Store mapping: old ID -> new ID
//                 bootcampIdMap[oldBootcampId] = newBootcamp._id;
                
//                 bootcampImportedCount++;
//                 console.log(`✅ Imported: ${bootcampData.name} (Old ID: ${oldBootcampId} -> New ID: ${newBootcamp._id})`);
                
//             } catch (error) {
//                 console.log(`❌ Failed to import ${bootcamps[i].name}:`, error.message);
//             }
//         }
        
//         // 3. THEN IMPORT COURSES WITH UPDATED BOOTCAMP IDs
//         console.log('\n📚 Importing courses...'.blue);
//         for (let i = 0; i < courses.length; i++) {
//             try {
//                 const courseData = courses[i];
                
//                 // Get the new bootcamp ID from our mapping
//                 const newBootcampId = bootcampIdMap[courseData.bootcamp];
                
//                 if (!newBootcampId) {
//                     console.log(`❌ No bootcamp found for course: ${courseData.title}`);
//                     continue;
//                 }
                
//                 // Remove the fixed _id and update bootcamp reference
//                 const { _id, ...courseWithoutId } = courseData;
                
//                 await Course.create({
//                     ...courseWithoutId,
//                     bootcamp: newBootcampId // Use the new bootcamp ID
//                 });
                
//                 courseImportedCount++;
//                 console.log(`✅ Imported course: ${courseData.title} (Bootcamp: ${newBootcampId})`);
                
//             } catch (error) {
//                 console.log(`❌ Failed to import course ${courses[i].title}:`, error.message);
//             }
//         }
//             // 4. IMPORT REVIEWS WITH UPDATED BOOTCAMP AND USER IDs
//             // 4. IMPORT REVIEWS WITH UPDATED BOOTCAMP AND USER IDs
//         console.log('\n⭐ Importing reviews...'.blue);
//         for (let i = 0; i < reviews.length; i++) {
//             try {
//                 const reviewData = reviews[i];
                
//                 // Get the new bootcamp ID and user ID from our mappings
//                 const newBootcampId = bootcampIdMap[reviewData.bootcamp];
//                 const newUserId = userIdMap[reviewData.user]; // This was failing because userIdMap wasn't defined
                
//                 if (!newBootcampId) {
//                     console.log(`❌ No bootcamp found for review: ${reviewData.title}`);
//                     continue;
//                 }
                
//                 if (!newUserId) {
//                     console.log(`❌ No user found for review: ${reviewData.title} (looking for user ID: ${reviewData.user})`);
//                     continue;
//                 }
                
//                 // Remove the fixed _id and update references
//                 const { _id, ...reviewWithoutId } = reviewData;
                
//                 await Review.create({
//                     ...reviewWithoutId,
//                     bootcamp: newBootcampId,
//                     user: newUserId
//                 });
                
//                 reviewImportedCount++;
//                 console.log(`✅ Imported review: "${reviewData.title}" (Rating: ${reviewData.rating})`);
                
//             } catch (error) {
//                 console.log(`❌ Failed to import review "${reviews[i].title}":`, error.message);
//             }
//         }
        
//         console.log(`\n🎉 SUCCESS SUMMARY:`.green.bold);
//         console.log(`✅ Bootcamps: ${bootcampImportedCount} out of ${bootcamps.length}`.green);
//         console.log(`✅ Courses: ${courseImportedCount} out of ${courses.length}`.green);
        
//         // Print bootcamp IDs for testing
//         console.log(`\n🔍 Bootcamp IDs for testing:`.blue.bold);
//         const allBootcamps = await Bootcamp.find().select('name _id');
//         allBootcamps.forEach(bootcamp => {
//             console.log(`   ${bootcamp.name}: ${bootcamp._id}`.cyan);
//         });
        
//         process.exit();
//     } catch (err) {
//         console.error('❌ Import Error:'.red, err);
//         process.exit(1);
//     }
// };


const importData = async () => {
    try {
        // Delete existing data first
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('🗑️ Old data deleted...'.red);
        
        let bootcampImportedCount = 0;
        let courseImportedCount = 0;
        let userImportedCount = 0;
        let reviewImportedCount = 0;

        // Store mappings for ID conversion
        const bootcampIdMap = {};
        const userIdMap = {}; // ADD THIS LINE - you were missing this!

        // 1. FIRST IMPORT USERS
        console.log('👤 Importing users...'.blue);
        for (let i = 0; i < users.length; i++) {
            try {
                const userData = users[i];
                const oldUserId = userData._id; // Store the old ID
                
                // Remove the fixed _id to let MongoDB generate a new one
                const { _id, ...userWithoutId } = userData;
                
                const newUser = await User.create(userWithoutId);
                
                // Store mapping: old user ID -> new user ID
                userIdMap[oldUserId] = newUser._id; // ADD THIS LINE
                
                userImportedCount++;
                console.log(`✅ Imported user: ${userData.name} (${userData.email}) - Old ID: ${oldUserId} -> New ID: ${newUser._id}`);
                
            } catch (error) {
                console.log(`❌ Failed to import user ${users[i].name}:`, error.message);
            }
        }
        
        // 2. IMPORT BOOTCAMPS
        console.log('🚀 Importing bootcamps...'.blue);
        for (let i = 0; i < bootcamps.length; i++) {
            try {
                const bootcampData = bootcamps[i];
                const oldBootcampId = bootcampData._id;
                
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
        
        // 3. IMPORT COURSES WITH UPDATED BOOTCAMP IDs
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
                    bootcamp: newBootcampId
                });
                
                courseImportedCount++;
                console.log(`✅ Imported course: ${courseData.title} (Bootcamp: ${newBootcampId})`);
                
            } catch (error) {
                console.log(`❌ Failed to import course ${courses[i].title}:`, error.message);
            }
        }
        
        // 4. IMPORT REVIEWS WITH UPDATED BOOTCAMP AND USER IDs
        console.log('\n⭐ Importing reviews...'.blue);
        for (let i = 0; i < reviews.length; i++) {
            try {
                const reviewData = reviews[i];
                
                // Get the new bootcamp ID and user ID from our mappings
                const newBootcampId = bootcampIdMap[reviewData.bootcamp];
                const newUserId = userIdMap[reviewData.user]; // This was failing because userIdMap wasn't defined
                
                if (!newBootcampId) {
                    console.log(`❌ No bootcamp found for review: ${reviewData.title}`);
                    continue;
                }
                
                if (!newUserId) {
                    console.log(`❌ No user found for review: ${reviewData.title} (looking for user ID: ${reviewData.user})`);
                    continue;
                }
                
                // Remove the fixed _id and update references
                const { _id, ...reviewWithoutId } = reviewData;
                
                await Review.create({
                    ...reviewWithoutId,
                    bootcamp: newBootcampId,
                    user: newUserId
                });
                
                reviewImportedCount++;
                console.log(`✅ Imported review: "${reviewData.title}" (Rating: ${reviewData.rating})`);
                
            } catch (error) {
                console.log(`❌ Failed to import review "${reviews[i].title}":`, error.message);
            }
        }
        
        console.log(`\n🎉 SUCCESS SUMMARY:`.green.bold);
        console.log(`✅ Users: ${userImportedCount} out of ${users.length}`.green);
        console.log(`✅ Bootcamps: ${bootcampImportedCount} out of ${bootcamps.length}`.green);
        console.log(`✅ Courses: ${courseImportedCount} out of ${courses.length}`.green);
        console.log(`✅ Reviews: ${reviewImportedCount} out of ${reviews.length}`.green);
        
        // Print IDs for testing
        console.log(`\n🔍 IDs for testing:`.blue.bold);
        
        const allBootcamps = await Bootcamp.find().select('name _id');
        console.log('   Bootcamps:'.cyan);
        allBootcamps.forEach(bootcamp => {
            console.log(`     ${bootcamp.name}: ${bootcamp._id}`.cyan);
        });

        const allUsers = await User.find().select('name email _id').limit(5);
        console.log('\n   Users (first 5):'.cyan);
        allUsers.forEach(user => {
            console.log(`     ${user.name} (${user.email}): ${user._id}`.cyan);
        });

        const allReviews = await Review.find().populate('bootcamp', 'name').populate('user', 'name');
        console.log('\n   Reviews:'.cyan);
        allReviews.forEach(review => {
            console.log(`     "${review.title}" - ${review.bootcamp.name} by ${review.user.name}`.cyan);
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
        await User.deleteMany(); // Also clear users
        await Review.deleteMany(); // Also clear reviews

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
