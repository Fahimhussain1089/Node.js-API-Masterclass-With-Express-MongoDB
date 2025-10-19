const express = require('express');

const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    getBootcampsDebug
    
} = require('../controllers/bootcamps');

// Include other resource routers
// const courseRouter = require('./courses'); --- IGNORE ---
const courseRouter = require('./courses');
const router = express.Router();

// Merge params to get access to bootcampId in course routes
// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);



router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/debug/locations').get(getBootcampsDebug);//--- IGNORE ---

router.route('/').get(getBootcamps).post(createBootcamp);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);

module.exports = router;