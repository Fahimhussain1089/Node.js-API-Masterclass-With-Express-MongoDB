const express = require('express');

const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    getBootcampsDebug,
    bootcampPhotoUpload
    
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');

// Include other resource routers
// const courseRouter = require('./courses'); --- IGNORE ---
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');
const router = express.Router();

// Merge params to get access to bootcampId in course routes
// Re-route into other resource routers

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

// Apply protect middleware to all bootcamp routes-------------------
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/:id/photo').put( protect ,authorize('publisher','admin'), bootcampPhotoUpload );



router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/debug/locations').get(getBootcampsDebug);//--- IGNORE ---

router
    .route('/')
    .get(advancedResults(Bootcamp,'courses'),getBootcamps)
    .post(protect , authorize('publisher','admin') , createBootcamp);
    
router
    .route('/:id')
    .get(getBootcamp)
    .put(protect ,authorize('publisher','admin'), updateBootcamp)
    .delete(protect ,authorize('publisher','admin'), deleteBootcamp);

module.exports = router;