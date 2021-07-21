const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// check if the user already exists (by email)
const userExists = async (email) => {
  // Find one user with this email, otherwise `null`
  const emailExists = await User.findOne({ email: email }).exec();
  return emailExists;
};

const registerUser = async (firstName, lastName, email, password) => {
  // hashing the password
  const salt = await bcrypt.genSalt(8);
  const hashedPassword = await bcrypt.hash(password, salt);

  // creating a new user
  const user = await new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashedPassword,
  });

  // save the user to database
  await user.save();

  return 'User created!';
};

// validate login
const validateLogin = async (email, password) => {
  const user = await User.findOne({ email: email }).exec();
  const validPassword = await bcrypt.compare(password, user.password);

  return { user, validPassword };
};

// create the token for the login
const createToken = async (user) => {
  const token = await jwt.sign({ _id: user.id }, process.env.SECRET_TOKEN);
  return token;
};

module.exports = { userExists, registerUser, validateLogin, createToken };
