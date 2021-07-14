const router = require('express').Router();

const TermsApi = require('./terms');

router.get('/', (req, res) => {
  res.send('This is the default api page');
});

router.use('/getTerms', TermsApi);

module.exports = router;
