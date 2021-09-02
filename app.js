const express = require('express');
const mongooseMorgan = require('mongoose-morgan');
const app = express();
const cors = require('cors');
const routes = require('./routes');
require('./database/connection');

const { insertTerms, getCount } = require('./database/actions/terms');
const { getTermsFromApi } = require('./services/terms');
const { filterTerms } = require('./helpers/terms');

const helmet = require('helmet');
const compression = require('compression');

app.use(helmet());
app.use(compression());
app.use(cors());
// use express.json to parse json data from the body
app.use(express.json());

// error logging using morgan

mongooseMorgan.token('status', (req, res) => {
  return res?.statusCode;
});
mongooseMorgan.token('statusMessage', (req, res) => {
  return res?.statusMessage;
});

app.use(
  mongooseMorgan(
    {
      collection: 'logs',
      connectionString: process.env.DATABASE_URI,
    },
    {
      skip: (_, res) => {
        return res?.statusCode < 400;
      },
    },
    ':date - :method - :url - status: :status - error_message: :statusMessage - :res[content-length] - :response-time ms'
  )
);

app.use(routes);

// error handling
app.use((err, req, res, next) => {
  res.statusCode = err.status;
  res.statusMessage = err.statusMessage;
  next(err);
});

// error sender
app.use((err, req, res, next) => {
  res.status(err.status).send({ message: err.statusMessage });
});

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

app.listen(process.env.PORT || 3000, () => {
  console.log(`Example app listening on port ${process.env.PORT || 3000}!`);
});
