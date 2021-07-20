const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes');
require('./database/connection');

const { insertTerms, getCount } = require('./database/actions/terms');
const { getTermsFromApi } = require('./services/terms');
const { filterTerms } = require('./helpers/terms');

app.use(cors());
// use express.json to parse json data from the body
app.use(express.json());
app.use(routes);

// check if the db has already the terms stored
getCount()
  .then((count) => {
    if (!count) {
      getTermsFromApi()
        .then(({ data }) => {
          const terms = data._embedded.terms;
          // filter data
          const termsData = filterTerms(terms);
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
