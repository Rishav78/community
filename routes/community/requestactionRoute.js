const router = require('express').Router();
const controllers= require('../../controllers');
const auth = require('../../auth/auth');


router.post('/:id',
        auth.isAuthenticated(),
        controllers.community.action.action);

module.exports = router;