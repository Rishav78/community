const router = require('express').Router();
const controllers= require('../../controllers');
const auth = require('../../auth/auth');

router.get('/',
        auth.isAuthenticated(),
        controllers.login.changepassword.serveChangePasswordPage);

router.post('/',
        auth.isAuthenticated(),
        controllers.login.changepassword.changepassword);

module.exports = router;