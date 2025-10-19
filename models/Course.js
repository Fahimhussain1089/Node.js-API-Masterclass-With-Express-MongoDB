const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');
const CourseSchemema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    weeks: {
        type: String,
        required: [true, 'Please add number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    // user: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User',
    //     required: true
    // }
});
//Static method to get avg of course tuitions
CourseSchemema.statics.getAverageCost = async function (bootcampId) {
    console.log('Calculating avg cost...'.blue);

    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' }
            }
        }
    ]);

    try {
        if (obj[0]) {
            await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
                averageCost: Math.ceil(obj[0].averageCost / 10) * 10
            });
            console.log('Average cost updated'.green);

        }
    } catch (err) {
        console.error(err);
    }
}
//Course
CourseSchemema.statics.getAverageCost = async function (bootcampId) {
    console.log('Calculating avg cost...'.blue);

    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }

        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' }
            }
        }
        
    ]);

    try {
        if (obj[0]) {
            await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
                averageCost: Math.ceil(obj[0].averageCost / 10) * 10
            });
            console.log('Average cost updated 01 ', 'id: '.yellow , obj[0]._id.green, obj[0].averageCost
            );
            }
    }catch (err) {
        console.error(err);
    }
        console.log(obj);


}


//Call getAverageCost after save
CourseSchemema.post('save', function () {
    this.constructor.getAverageCost(this.bootcamp);
});
//Call getAverageCost before remove
CourseSchemema.pre('remove', function () {
    this.constructor.getAverageCost(this.bootcamp);
});


module.exports = mongoose.model('Course', CourseSchemema);

