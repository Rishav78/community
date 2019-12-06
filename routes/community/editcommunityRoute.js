const router = require('express').Router();
const controllers= require('../../controllers');
const auth = require('../../auth/auth');

router.get('/:id',
        auth.isAuthenticated(),
        controllers.community.editcommunity.serveEditCommunityPage);

router.post('/:id',
        auth.isAuthenticated(),
        controllers.community.editcommunity.updateComapnyInformation);

module.exports = router;