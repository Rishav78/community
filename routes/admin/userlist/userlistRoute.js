const router = require('express').Router();
const controllers = require('../../../controllers');
const auth = require('../../../auth/auth');

router.get('/',
        auth.isAuthenticated(),
        controllers.admin.userlist.userlist.serveUserlistPage);

router.post('/', 
        auth.isAuthenticated(),
        controllers.admin.userlist.userlist.userlist);

// console.log(controllers.admin.userlist.userlist.userinfo)
router.get('/:id',
        auth.isAuthenticated(),
        controllers.admin.userlist.userlist.userinfo);

module.exports = router;