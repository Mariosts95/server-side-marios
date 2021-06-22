const router = require('express').Router();
const fetch = require('node-fetch');
const { getTerms } = require('../../services/terms');

router.get('/', (req, res) => {
  const { page, size } = req.query;
  getTerms(page, size).then(({data})=>{res.send(data._embedded.terms)}).catch(err=>{console.log(err)});
});


module.exports = router;