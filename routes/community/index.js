const router = require('express').Router();

router.use('/updateProfilePic', require('./uploadProfilePicRoute'));
router.use('/communityList', require('./communitylistRoute'));
router.use('/communitypanel', require('./communitypanelRoute'));
router.use('/Addcommunity', require('./addcommunityRoute'));
router.use('/manageCommunity', require('./managecommuityRoute'));
router.use('/CommunityMembers', require('./communnitymembersRoute'));
router.use('/CommunitysAdmins', require('./communityadminsRoute'));
router.use('/invitedUsers', require('./inviteduserRoute'));
router.use('/invite', require('./inviteuserRoute'));
router.use('/inviteList', require('./invitelistRoute'));
router.use('/deleteInvite', require('./deleteinviteRoute'));


module.exports = router;
