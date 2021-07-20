const router = require('express').Router();
const { userExists, registerUser } = require('../../database/actions/user');
const { RegisterSchema } = require('../../helpers/user');

router.post('/register', (req, res) => {
  // get the credentials from the form
  const { firstName, lastName, email, password } = req.body;
  // check if the user exists
  userExists(email)
    .then(async (data) => {
      if (data) {
        return res.status(200).send('User already exists!');
      } else {
        try {
          // if there is an error we get it with deconstruction from the body
          const { error } = await RegisterSchema.validateAsync(req.body);
          if (error) {
            return res.status(400).send(error);
          } else {
            // if there is not an error we save the user to the db
            registerUser(firstName, lastName, email, password)
              .then((data) => {
                res.status(200).send(data);
              })
              .catch((error) => {
                res.status(400).send(error);
              });
          }
        } catch (error) {
          res.status(400).send(error.message);
        }
      }
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

module.exports = router;
