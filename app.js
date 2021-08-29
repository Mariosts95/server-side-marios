const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
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

// error logging using morgan

morgan.token('status', (req, res) => {
  return res?.error?.status || 0;
});
morgan.token('statusMessage', (req, res) => {
  return res?.error?.statusMessage || '';
});

const accessLogStream = fs.createWriteStream(path.join(`${__dirname}/logs`, 'error.log'), {
  flags: 'a',
});

app.use(
  morgan(':date - :method - :url - status: :status - error_message: :statusMessage - :res[content-length] - :response-time ms', {
    stream: accessLogStream,
    skip: (_, res) => {
      return res?.error?.status < 400 || !res?.error?.status;
    },
  })
);

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

// error handling
app.use((err, req, res, next) => {
  res.error = err; // we set in the response error property our custom error
  next(err); // with next() we allow the middleware to proceed to the next available action / middleware (in our case at the error sender middleware)
});
// error sender
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ message: err.statusMessage });
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});
