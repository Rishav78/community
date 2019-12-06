const router = require('express').Router();
const controllers= require('../../controllers');
const auth = require('../../auth/auth');

router.get('/',
        auth.isAuthenticated(),
        controllers.login.editinformation.serveEditInformationPage);

router.post('/',
        auth.isAuthenticated(),
        controllers.login.editinformation.updateInformation);

module.exports = router;