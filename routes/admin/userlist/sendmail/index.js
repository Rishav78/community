const router = require('express').Router();

router.use('/', require('./sendmailRoute'));

module.exports = router;