const router = require('express').Router();

router.use('/profile', require('./profile'));
router.use('/adduser', require('./adduserRoute'));
router.use('/userlist', require('./userlist'));

module.exports = router;