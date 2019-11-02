const router = require('express').Router();

router.use('/', require('./userlistRoute'));
router.use('/sendmail', require('./sendmail'));
router.use('/update', require('./updateRoute'));

module.exports = router;

