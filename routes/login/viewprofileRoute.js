const router = require('express').Router();
const controllers= require('../../controllers');
const auth = require('../../auth/auth');

router.get('/:id',
        auth.isAuthenticated(),
        controllers.login.viewprpofile.viewProfile);


module.exports = router;  