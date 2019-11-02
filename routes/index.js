const router = require('express').Router();

console.log(require('./admin'));

router.use('/admin', require('./admin/'));
router.use('/communnity', require('./community/'));

module.exports = router;