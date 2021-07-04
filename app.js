const express = require('express');
const app = express();
const routes = require('./routes');
require('./database/connection');

app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});
