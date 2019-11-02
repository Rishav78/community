const router = require('express').Router();
const uploadProfilePic = require('./uploadProfilePicRoute');

router.use('/updateProfilePic', require('./uploadProfilePicRoute'));

module.exports = router;
