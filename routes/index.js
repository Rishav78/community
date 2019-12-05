const router = require('express').Router();

router.use('/admin', require('./admin/'));
router.use('/community', require('./community/'));
router.use('/', require('./login/'));

module.exports = router;