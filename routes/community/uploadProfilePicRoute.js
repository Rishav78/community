const router = require('express').Router();
const controllers= require('../../controllers');
const auth = require('../../auth/auth');

router.post('/',
        auth.isAuthenticated(),
        controllers.community.uploadProfilePic.uploadProfilePic);

module.exports = router;