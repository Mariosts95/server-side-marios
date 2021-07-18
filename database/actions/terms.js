const TermSchema = require('../models/terms');

const insertTerms = async (terms) => {
  try {
    // send the data to the database
    TermSchema.insertMany(terms);
  } catch (error) {
    console.log(error);
  }
};

// get the estimated document number in the database
const getCount = async () => {
  return TermSchema.estimatedDocumentCount();
};

// get terms with pagination
const getTerms = async (page, size) => {
  // convert the params from string to number
  page = parseInt(page);
  size = parseInt(size);
  const terms = await TermSchema.find()
    .skip((page - 1) * size)
    .limit(size)
    .exec();

  // get the exact count
  const count = await TermSchema.countDocuments();
  return { terms, count };
};

module.exports = { insertTerms, getCount, getTerms };
