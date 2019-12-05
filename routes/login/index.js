const router = require('express').Router();

router.use('/', require('./loginRoute'));
router.use('/switchAsUser', require('./switchUserRoute'));
router.use('/profile', require('./profileRoute'));
router.use('/changePassword', require('./changepasswordRoute'));
router.use('/logout', require('./logoutRoute'));

module.exports = router;