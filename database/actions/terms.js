const TERMS_SCHEMA = require('../models/terms');

const insertTerms = async (terms) => {
  try {
    //   iterate through the terms array and create a document for each term
    for (const term of terms) {
      // using await to avoid conflict in the for loop
      await TERMS_SCHEMA.create(term);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { insertTerms };
