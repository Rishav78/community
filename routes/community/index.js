const router = require('express').Router();

router.use('/updateProfilePic', require('./uploadProfilePicRoute'));
router.use('/communityList', require('./communitylistRoute'));
router.use('/communitypanel', require('./communitypanelRoute'));
router.use('/Addcommunity', require('./addcommunityRoute'));

module.exports = router;
