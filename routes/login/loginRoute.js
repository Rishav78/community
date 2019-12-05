const router = require('express').Router();
const controllers= require('../../controllers');

router.get('/', controllers.login.login.serveLoginPage);
router.post('/', controllers.login.login.login);

module.exports = router;