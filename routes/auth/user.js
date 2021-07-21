const router = require('express').Router();
const { userExists, registerUser, validateLogin, createToken } = require('../../database/actions/user');
const { RegisterSchema, LoginSchema } = require('../../helpers/user');

router.post('/register', async (req, res) => {
  // get the credentials from the form
  const { firstName, lastName, email, password } = req.body;
  try {
    // check if the user exists
    if (await userExists(email)) return res.status(200).send('User already exists!');
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
});

router.post('/login', async (req, res) => {
  // get the credentials from the form
  const { email, password } = req.body;
  try {
    // if there is an error we get it with deconstruction from the body
    const { error } = await LoginSchema.validateAsync(req.body);
    if (error) {
      return res.status(400).send(error);
    } else {
      // check if the user exists
      userExists(email).then((data) => {
        if (!data) {
          res.status(400).send('User does not exist!');
        } else {
          // check if the passwords match
          validateLogin(email, password).then((data) => {
            if (!data.validPassword) {
              res.status(400).send('Incorrect password');
            } else {
              createToken(email).then((token) => {
                res.header('auth-token', token).send(token);
              });
            }
          });
        }
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
