const router = require('express').Router();
const uploadProfilePic = require('./uploadProfilePicRoute');

router.use('/updateProfilePic', require('./uploadProfilePicRoute'));
router.use('/communityList', require('./communitylistRoute'));

module.exports = router;
