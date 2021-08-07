const router = require('express').Router();
const { userExists, registerUser, validateLogin } = require('../../database/actions/user');
const { RegisterSchema, LoginSchema, createToken } = require('../../helpers/user');
const { sendEmail } = require('../../services/email');

router.post('/register', async (req, res) => {
  // get the credentials from the form
  const user = req.body;
  try {
    // check if the user exists
    if (await userExists(user.email)) return res.status(200).send('User already exists!');
    // if there is an error we get it with deconstruction from the body
    const { error } = await RegisterSchema.validateAsync(req.body);
    if (error) {
      return res.status(400).send(error);
    } else {
      // if there is not an error we save the user to the db
      registerUser(user)
        .then((data) => {
          console.log(data.user);
          sendEmail(data.user, req.get('origin'));
          res.status(200).send(data.message);
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
  const user = req.body;
  try {
    // if there is an error we get it with deconstruction from the body
    const { error } = await LoginSchema.validateAsync(req.body);
    if (error) {
      return res.status(400).send(error);
    } else {
      // check if the user exists
      userExists(user.email).then((data) => {
        if (!data) {
          res.status(400).send('User does not exist!');
        } else {
          // check if the passwords match
          validateLogin(user.email, user.password).then((data) => {
            if (!data.validPassword) {
              res.status(400).send('Incorrect password');
            } else {
              createToken(user.email).then((token) => {
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
