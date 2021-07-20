const mongoose = require('mongoose');

// Schema for each term in db
const TermSchema = mongoose.Schema({
  key: { type: String, unique: true, required: true },
  label: { type: String, required: true },
  synonyms: { type: String },
  obo_id: { type: String },
  term_editor: { type: String },
  has_children: { type: Boolean },
});

TermSchema.index({ key: 1 });

// assign the document in the 'terms' collection in db
const model = mongoose.model('terms', TermSchema);

module.exports = model;
