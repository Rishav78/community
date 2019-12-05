const router = require('express').Router();
const controllers= require('../../controllers');
const auth = require('../../auth/auth');

router.get('/:id',
        auth.isAuthenticated(),
        controllers.community.inviteusers.serveInviteuserPage);

router.post('/:id',
        auth.isAuthenticated(),
        controllers.community.inviteusers.inviteuser);

module.exports = router;