const router = require('express').Router();

const TermsApi = require('./terms');

router.use('/', TermsApi);

module.exports = router;
