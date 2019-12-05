const router = require('express').Router();

router.use('/', require('./loginRoute'));
router.use('/switchAsUser', require('./switchUserRoute'));
router.use('/profile', require('./profileRoute'));
router.use('/changePassword', require('./changepasswordRoute'));

module.exports = router;