const axios = require('axios');

const getTerms = async (page , size) => {
    return await axios.get(`https://www.ebi.ac.uk/ols/api/ontologies/efo/terms/?page=${page}&size=${size}`)
};

module.exports = {getTerms};