const router = require('express').Router();
const { getTerms, addTerm, updateTerm, deleteTerm } = require('../../database/actions/terms');

router.get('/getTerms', (req, res, next) => {
  // get the parameters from query
  const { from, size } = req.query;

  // return the terms based on the params
  getTerms(from, size)
    .then((data) => {
      if (!data) throw { status: 400, statusMessage: 'Error on receiving the terms' };
      return res.status(200).send(data);
    })
    .catch((error) => {
      next(error);
    });
});

// add new term
router.post('/createTerm', (req, res, next) => {
  const { term } = req.body;
  addTerm(term)
    .then((newTerm) => {
      return res.status(200).send(newTerm);
    })
    .catch((error) => {
      next(error);
    });
});

// edit term
router.put('/term/:id', (req, res, next) => {
  const { id } = req.params;
  const { term } = req.body;
  updateTerm(id, term)
    .then((term) => {
      return res.status(200).send({ term });
    })
    .catch((error) => {
      next(error);
    });
});

// delete term
router.delete('/term/:id', (req, res, next) => {
  const { id } = req.params;
  deleteTerm(id)
    .then((term) => {
      res.status(200).send({ term });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
