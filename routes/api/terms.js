const router = require('express').Router();
const { getTerms } = require('../../services/terms');
const { insertTerms } = require('../../database/actions/terms');

router.get('/', (req, res) => {
  res.send('This is the default terms page');
});

router.get('/getterms', (req, res) => {
  // Get the page & size parameters from the query
  const { page, size } = req.query;
  getTerms(page, size)
    .then(({ data }) => {
      const terms = data._embedded.terms;
      // filter data
      const termsData = terms.map((term) => ({
        key: term.obo_id,
        label: term.label,
        synonyms: term.synonyms ? term.synonyms.join(', ') : '-',
        obo_id: term.obo_id,
        term_editor: term.annotation['term editor'] ? term.annotation['term editor'].join(', ') : '-',
        has_children: term.has_children,
      }));
      // insert data in the database
      insertTerms(termsData);
    })
    .catch((err) => {
      res.status(400);
      console.log(err);
    });
});

module.exports = router;
