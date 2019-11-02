const router = require('express').Router();
const controllers = require('../../controllers');
const auth = require('../../auth/auth');

router.get('/', 
        auth.isAuthenticated(),
        controllers.admin.adduser.serveAdduserPage)


router.post('/',
        auth.isAuthenticated(),
        controllers.admin.adduser.addNewUser)

module.exports = router;