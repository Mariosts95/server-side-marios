const axios = require('axios');
// get terms from external API as a promise using axios
const getTermsFromApi = async () => {
  return await axios.get(process.env.TERMS_API_ENDPOINT);
};

module.exports = { getTermsFromApi };
