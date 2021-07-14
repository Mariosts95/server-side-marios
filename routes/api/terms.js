const router = require('express').Router();
const { getTerms } = require('../../database/actions/terms');

router.get('/', (req, res) => {
  const { from, size } = req.query;
  getTerms(from, size)
    .then((data) => res.status(200).send(data))
    .catch((error) => {
      res.status(400).send(error);
    });
});

module.exports = router;
