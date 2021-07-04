const router = require('express').Router();
const { getTerms } = require('../../services/terms');

router.get('/', (req, res) => {
  res.send('This is the default terms page');
});

router.get('/getterms', (req, res) => {
  // Get the page & size parameters from the query
  const { page, size } = req.query;
  getTerms(page, size)
    .then(({ data }) => {
      res.status(200).send(data._embedded.terms);
    })
    .catch((err) => {
      res.status(400);
      console.log(err);
    });
});

module.exports = router;
