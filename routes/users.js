const express = require('express');

const {
    getUsers,
    getUser,
    deleteUser,
    updateUser,
    createUser
} = require('../controllers/users');

const User = require('../models/User');
const advancedResults = require('../middleware/advancedResults');


const router = express.Router(mergeParams = true);
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.route('/')
    .all(advancedResults(User))
    .get(getUsers)
    .post(createUser);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;