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

// get the exact count
const getExactCount = async () => {
  return TERMS_SCHEMA.countDocuments();
};

// get terms with pagination
const getTerms = async (page, size) => {
  // convert the params from string to number
  page = parseInt(page);
  size = parseInt(size);
  return await TERMS_SCHEMA.find()
    .skip(page * size)
    .limit(size);
};

module.exports = { insertTerms, getCount, getTerms, getExactCount };
