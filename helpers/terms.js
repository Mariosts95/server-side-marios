// create the mapping to filter the data before enter db
const filterTerms = (terms) => {
  return terms.map((term) => ({
    key: term.obo_id,
    label: term.label,
    synonyms: term.synonyms ? term.synonyms.join(', ') : '-',
    obo_id: term.obo_id,
    term_editor: term.annotation['term editor'] ? term.annotation['term editor'].join(', ') : '-',
    has_children: term.has_children,
  }));
};

module.exports = { filterTerms };
