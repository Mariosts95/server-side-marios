const mongoose = require('mongoose');

// Schema for each term in db
const TERMS_SCHEMA = mongoose.Schema({
  key: { type: String, unique: true, required: true },
  label: { type: String, required: true },
  synonyms: { type: String },
  obo_id: { type: String },
  term_editor: { type: String },
  has_children: { type: Boolean },
});

// TERMS_SCHEMA.index({ key });

// assign the document in the 'terms' collection in db
const model = mongoose.model('terms', TERMS_SCHEMA);

module.exports = model;
