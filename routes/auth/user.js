const router = require('express').Router();
const { findUser, registerUser, validateLogin, resetPassword } = require('../../database/actions/user');
const { User } = require('../../database/models/user');
const { RegisterSchema, LoginSchema, ResetPasswordSchema, createToken, ForgotPasswordSchema } = require('../../helpers/user');
const { sendVerifyEmail, sendResetEmail, sendResetSuccessEmail } = require('../../services/email');

// register user path
router.post('/register', async (req, res, next) => {
  // get the credentials from the form
  const user = req.body;
  try {
    // if there is an error we get it with deconstruction from the body
    await RegisterSchema.validateAsync(req.body).catch((error) => {
      throw { status: 400, statusMessage: error.details[0].message };
    });
    // check if the user exists
    const newUser = await findUser(user.email);
    if (newUser) throw { status: 400, statusMessage: 'The email already exists' };
    // if there is not an error we save the user to the db
    registerUser(user)
      .then((data) => {
        sendVerifyEmail(data.user, req.get('origin'));
        res.status(200).send({ message: 'Registration successful, please check your email for verification instructions' });
      })
      .catch((error) => {
        throw { status: 400, statusMessage: error };
      });
  } catch (error) {
    next(error);
  }
});

// verify user path
router.post('/verify-email', async (req, res, next) => {
  // get the token send in the mail
  const { token } = req.body;
  try {
    // find the user and update the status to Verified with the date of the verification
    const user = await User.findOne({ verificationToken: token }).exec();
    if (!user) throw { status: 400, statusMessage: 'Verification failed' };
    user.verified = await new Date();
    await user.save();
    res.status(200).send({ message: 'Verification successful, you can now login' });
  } catch (error) {
    next(error);
  }
});

// forgot password path
router.post('/forgot-password', async (req, res, next) => {
  // get the token send in the mail
  const { email } = req.body;
  try {
    await ForgotPasswordSchema.validateAsync(req.body).catch((error) => {
      throw { status: 400, statusMessage: error.details[0].message };
    });
    // find the user and update the status to Verified with the date of the verification
    const user = await User.findOne({ email: email }).exec();
    // check if the user exists
    if (!user) throw { status: 400, statusMessage: "Email doesn't exist, please check your email" };
    // check if the user is verified
    if (!user.verified) throw { status: 400, statusMessage: 'User not verified!' };
    user.resetToken = await createToken(email);
    await user.save();
    await sendResetEmail(user, req.get('origin'));
    return res.status(200).send({ message: 'Please check your email for password reset instructions' });
  } catch (error) {
    next(error);
  }
});

// reset password path
router.post('/reset-password', async (req, res, next) => {
  const { token, password, confirmPassword } = req.body;
  try {
    // validate the users input
    await ResetPasswordSchema.validateAsync(req.body).catch((error) => {
      throw { status: 400, statusMessage: error.details[0].message };
    });
    // find the user in database
    const user = await User.findOne({ resetToken: token }).exec();
    if (!user) throw { status: 400, statusMessage: 'Invalid token' };
    user.password = await resetPassword(password);
    await user.save();
    await sendResetSuccessEmail(user, req.get('origin'));
    return res.status(200).send({ message: 'Password reset successful, you can now login' });
  } catch (error) {
    next(error);
  }
});

// login path
router.post('/login', async (req, res, next) => {
  // get the credentials from the form
  const user = req.body;
  try {
    // if there is an error we get it with deconstruction from the body
    await LoginSchema.validateAsync(req.body).catch((error) => {
      throw { status: 400, statusMessage: error.details[0].message };
    });
    // check if the user exists
    findUser(user.email)
      .then((data) => {
        if (!data) {
          throw { status: 400, statusMessage: 'Email or password is incorrect' };
        } else {
          // check if the passwords match
          validateLogin(user.email, user.password)
            .then((data) => {
              if (!data.validPassword || !data.verified) {
                throw { status: 400, statusMessage: 'Email or password is incorrect' };
              } else {
                createToken(user.email).then((token) => {
                  return res.header('auth-token', token).send(token);
                });
              }
            })
            .catch((error) => {
              next(error);
            });
        }
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
