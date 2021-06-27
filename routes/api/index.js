const router = require('express').Router();

const getTermsApi = require('./getTerms');
// const termApi = require('./term');

router.use('/getterms', getTermsApi);
// router.use('/term/:id', termApi);

module.exports = router;
