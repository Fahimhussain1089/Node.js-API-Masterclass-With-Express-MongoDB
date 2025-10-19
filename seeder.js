const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const Bootcamp = require('./models/Bootcamp');
const dotenv = require('dotenv');
const geocoder = require('./utils/geocoder'); // Add this


// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

// Read JSON files
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

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
const importData = async () => {
    try {
        // Delete existing data first
        await Bootcamp.deleteMany();
        console.log('Old data deleted...');
        
        let importedCount = 0;
        
        // Geocode each bootcamp and create individually
        for (let i = 0; i < bootcamps.length; i++) {
            try {
                const bootcampData = bootcamps[i];
                console.log(`Geocoding: ${bootcampData.name} - ${bootcampData.address}`);
                
                // Geocode the address
                const loc = await geocoder.geocode(bootcampData.address);
                
                if (!loc || loc.length === 0) {
                    console.log(`❌ Could not geocode: ${bootcampData.address}`);
                    continue;
                }
                
                console.log(`✅ Geocoded to: ${loc[0].latitude}, ${loc[0].longitude}`);
                
                // Create bootcamp with location data
                await Bootcamp.create({
                    ...bootcampData,
                    location: {
                        type: 'Point',
                        coordinates: [loc[0].longitude, loc[0].latitude],
                        formattedAddress: loc[0].formattedAddress,
                        street: loc[0].streetName,
                        city: loc[0].city,
                        state: loc[0].stateCode,
                        zipcode: loc[0].zipcode,
                        country: loc[0].countryCode
                    }
                });
                
                importedCount++;
                console.log(`✅ Imported: ${bootcampData.name}`);
                
            } catch (error) {
                console.log(`❌ Failed to import ${bootcamps[i].name}:`, error.message);
            }
        }
        
        console.log(`🎉 Successfully imported ${importedCount} out of ${bootcamps.length} bootcamps`.green.inverse);
        process.exit();
    } catch (err) {
        console.error('Import Error:', err);
        process.exit(1);
    }
};

//__________________End Geocoding____________________
// Delete data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
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
