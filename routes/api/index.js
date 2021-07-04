const router = require('express').Router();

const TermsApi = require('./terms');

router.get('/', (req, res) => {
  res.send('This is the default api page');
});

router.use('/terms', TermsApi);

module.exports = router;
