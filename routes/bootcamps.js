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


const router  = express.Router();

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/debug/locations').get(getBootcampsDebug);//--- IGNORE ---

router.route('/').get(getBootcamps).post(createBootcamp);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);

module.exports = router;