const router = require('express').Router();
const controllers= require('../../controllers');
const auth = require('../../auth/auth');

router.get('/',
        auth.isAuthenticated(),
        controllers.community.communitylist.serveCommunitylistPage);
    
module.exports = router;