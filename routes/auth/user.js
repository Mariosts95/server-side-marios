const router = require('express').Router();
const { userExists, registerUser, validateLogin, resetPassword } = require('../../database/actions/user');
const { User } = require('../../database/models/user');
const { RegisterSchema, LoginSchema, ResetPasswordSchema, createToken } = require('../../helpers/user');
const { sendVerifyEmail, sendResetEmail, sendResetSuccessEmail } = require('../../services/email');

// register user path
router.post('/register', async (req, res) => {
  // get the credentials from the form
  const user = req.body;
  try {
    // check if the user exists
    if (await userExists(user.email)) return res.status(200).send({ message: 'The email already exists' });
    // if there is an error we get it with deconstruction from the body
    const { error } = await RegisterSchema.validateAsync(req.body);
    if (error) {
      return res.status(400).send({ message: error });
    } else {
      // if there is not an error we save the user to the db
      registerUser(user)
        .then((data) => {
          sendVerifyEmail(data.user, req.get('origin'));
          res.status(200).send({ message: 'Registration successful, please check your email for verification instructions' });
        })
        .catch((error) => {
          res.status(400).send(error);
        });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// verify user path
router.post('/verify-email', async (req, res) => {
  // get the token send in the mail
  const { token } = req.body;
  try {
    // find the user and update the status to Verified with the date of the verification
    const user = await User.findOne({ verificationToken: token }).exec();
    user.verified = await new Date();
    await user.save();
    res.status(200).send({ message: 'Verification successful, you can now login' });
  } catch (error) {
    res.status(400).send({ message: 'Verification failed' });
  }
});

// forgot password path
router.post('/forgot-password', async (req, res) => {
  // get the token send in the mail
  const { email } = req.body;
  try {
    // find the user and update the status to Verified with the date of the verification
    const user = await User.findOne({ email: email }).exec();
    if (!user.verified) {
      return res.status(400).send({ message: 'User not verified!' });
    } else {
      user.resetToken = await createToken(email);
      await user.save();
      await sendResetEmail(user, req.get('origin'));
      await res.status(200).send({ message: 'Please check your email for password reset instructions' });
    }
  } catch (error) {
    res.status(400).send({ message: "Email doesn't exist, please check your email" });
  }
});

// reset password path
router.post('/reset-password', async (req, res) => {
  const { token, password, confirmPassword } = req.body;
  try {
    // validate the users input
    const { error } = await ResetPasswordSchema.validateAsync(req.body);
    if (error) {
      return res.status(400).send(error);
    } else {
      // find the user in database
      const user = await User.findOne({ resetToken: token }).exec();
      // check if the user is verified
      user.password = await resetPassword(password);
      await user.save();
      await sendResetSuccessEmail(user, req.get('origin'));
      await res.status(200).send({ message: 'Password reset successful, you can now login' });
    }
  } catch (error) {
    return res.status(400).send({ message: 'Invalid token' });
  }
});

// login path
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
          res.status(400).send({ message: 'Email or password is incorrect' });
        } else {
          // check if the passwords match
          validateLogin(user.email, user.password).then((data) => {
            if (!data.validPassword || !data.verified) {
              res.status(400).send({ message: 'Email or password is incorrect' });
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
