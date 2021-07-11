const router = require('express').Router();
const { getTerms } = require('../../database/actions/terms');

router.get('/', (req, res) => {
  res.send('This is the default terms page');
});

router.get('/getTerms', (req, res) => {
  const { page, size } = req.query;
  getTerms(page, size)
    .then((data) => res.status(200).send(data).json())
    .catch((error) => {
      res.status(400).send(error);
    });
});

module.exports = router;
