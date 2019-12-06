const router = require('express').Router();
const controllers= require('../../controllers');
const auth = require('../../auth/auth');

router.get('/',
        auth.isAuthenticated(),
        controllers.community.list.serveListPage);
    
router.post('/',
        auth.isAuthenticated(),
        controllers.community.list.communityList);

module.exports = router;