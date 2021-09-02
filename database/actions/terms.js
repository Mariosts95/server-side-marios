const Term = require('../models/terms');

const insertTerms = async (terms, next) => {
  try {
    // send the data to the database
    Term.insertMany(terms);
  } catch (error) {
    next(error);
  }
};

const addTerm = async (term) => {
  // creating a new term
  const newTerm = await new Term({
    key: term.key,
    label: term.label,
    synonyms: term.synonyms,
    obo_id: term.obo_id,
    term_editor: term.term_editor,
    has_children: term.has_children,
  });
  // save the term to database
  await newTerm.save();
  return newTerm;
};

const updateTerm = async (id, data) => {
  await Term.findOneAndUpdate({ key: id }, data);
  let term = await Term.findOne({ key: id }).exec();
  if (!term) throw { error: 404, statusMessage: 'Undefined term' };
  return term;
};

const deleteTerm = async (id) => {
  let term = await Term.findOne({ key: id }).exec();
  await Term.findOneAndDelete({ key: id });
  if (!term) throw { error: 404, statusMessage: 'Undefined term' };
  return term;
};

// get the estimated document number in the database
const getCount = async () => {
  return Term.estimatedDocumentCount();
};

// get terms with pagination
const getTerms = async (page, size) => {
  // convert the params from string to number
  page = parseInt(page);
  size = parseInt(size);
  const terms = await Term.find()
    .skip((page - 1) * size)
    .limit(size)
    .exec();

  // get the exact count
  const count = await Term.countDocuments();
  return { terms, count };
};

module.exports = { insertTerms, getCount, getTerms, addTerm, updateTerm, deleteTerm };
