const router = require('express').Router();
const controllers= require('../../controllers');
const auth = require('../../auth/auth');

router.get('/', controllers.login.login.serveLoginPage);
router.post('/', controllers.login.login.login);

module.exports = router;