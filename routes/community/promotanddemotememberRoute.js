const router = require('express').Router();
const controllers= require('../../controllers');
const auth = require('../../auth/auth');

router.put('/:id',
        auth.isAuthenticated(),
        controllers.community.promotordemote.promotAndDemote);

module.exports = router;