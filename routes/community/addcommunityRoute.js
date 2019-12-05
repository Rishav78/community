const router = require('express').Router();
const controllers= require('../../controllers');
const auth = require('../../auth/auth');

router.get('/',
        auth.isAuthenticated(),
        controllers.community.addcommunity.serveAddCommunityPage);


router.post('/', 
        auth.isAuthenticated(),
        controllers.community.addcommunity.createCommunity);

module.exports = router;