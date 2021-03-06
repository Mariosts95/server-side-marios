const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// check if the user already exists (by email)
const findUser = async (email) => {
  // Find one user with this email, otherwise `null`
  const user = await User.findOne({ email: email }).exec();
  return user;
};

const registerUser = async (account) => {
  // hashing the password
  const salt = await bcrypt.genSalt(8);
  const hashedPassword = await bcrypt.hash(account.password, salt);

  // creating a new user
  const user = await new User({
    firstName: account.firstName,
    lastName: account.lastName,
    email: account.email,
    password: hashedPassword,
    verificationToken: await validationToken(),
  });

  // save the user to database
  await user.save();
  let message = 'User created!';
  return { user, message };
};

const resetPassword = async (newPassword) => {
  // hashing the password
  const salt = await bcrypt.genSalt(8);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  return hashedPassword;
};

// validate login
const validateLogin = async (email, password) => {
  const user = await User.findOne({ email: email }).exec();
  if (!user) throw { status: 400, statusMessage: 'Email or password is incorrect' };
  const validPassword = await bcrypt.compare(password, user.password);
  const verified = user.verified;
  if (!validPassword || !verified) throw { status: 400, statusMessage: 'Email or password is incorrect' };
  return { user, validPassword, verified };
};

// validation token
const validationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = { findUser, registerUser, validateLogin, validationToken, resetPassword };
