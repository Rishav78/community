const router = require('express').Router();
const controllers= require('../../controllers');
const auth = require('../../auth/auth');

router.delete('/:id',
        auth.isAuthenticated(),
        controllers.community.deletemember.deletemember);

        module.exports = router;