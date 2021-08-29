const router = require('express').Router();
const { getTerms, addTerm } = require('../../database/actions/terms');

router.get('/getTerms', (req, res, next) => {
  const { from, size } = req.query;
  getTerms(from, size)
    .then((data) => {
      if (!data) throw { status: 400, statusMessage: 'Error on receiving the terms' };
      return res.status(200).send(data);
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/createTerm', (req, res, next) => {
  const { term } = req.body;
  addTerm(term)
    .then((data) => {
      console.log(data);
      return res.status(200).send(data);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
