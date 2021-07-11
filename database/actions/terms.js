const TERMS_SCHEMA = require('../models/terms');

const insertTerms = async (terms) => {
  try {
    // send the data to the database
    TERMS_SCHEMA.insertMany(terms);
  } catch (error) {
    console.log(error);
  }
};

// get the estimated document number in the database
const getCount = async () => {
  return TERMS_SCHEMA.estimatedDocumentCount();
};

module.exports = { insertTerms, getCount };
