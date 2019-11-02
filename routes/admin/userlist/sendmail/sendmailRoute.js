const router = require('express').Router();
const controllers = require('../../../../controllers');
const auth = require('../../../../auth/auth');


router.post('/',
        auth.isAuthenticated(),
        controllers.admin.userlist.sendmail.sendmail.sendmail);

module.exports = router;