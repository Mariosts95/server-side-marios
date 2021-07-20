const router = require('express').Router();
const UserApi = require('./user');

router.use('/', UserApi);

module.exports = router;
