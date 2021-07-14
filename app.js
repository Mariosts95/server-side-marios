const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes');
require('./database/connection');

const { insertTerms, getCount } = require('./database/actions/terms');
const { getTermsFromApi } = require('./services/terms');

app.use(cors());
app.use(routes);

// check if the db has already the terms stored
getCount()
  .then((count) => {
    if (!count) {
      getTermsFromApi()
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
        .then(console.log('Database updated'))
        .catch((error) => {
          res.status(400);
          console.log(error);
        });
    } else {
      console.log('Database already full');
    }
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});
