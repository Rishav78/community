const uploadProfilePic = require('./uploadProfilePicController');
const communitylist = require('./communitylistController');
const communitypanel = require('./communitypanelController');
const addcommunity = require('./addcommunityController');
const managecommunity = require('./managecommunityController');
const communitymembers = require('./communitymembersController');
const communityadmin = require('./communityadminController');
const invitedusers = require('./inviteduserController');
const inviteusers = require('./inviteuserController');
const invitelist = require('./invitelistController');
const deleteinvite = require('./deleteinviteController');

module.exports = {
    uploadProfilePic,
    communitylist,
    communitypanel,
    addcommunity,
    managecommunity,
    communitymembers,
    communityadmin,
    invitedusers,
    inviteusers,
    invitelist,
    deleteinvite,
}