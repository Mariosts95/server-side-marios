const { User } = require('../models/user');
const bcrypt = require('bcrypt');

// check if the user already exists (by email)
const userExists = async (email) => {
  // Find one user with this email, otherwise `null`
  const emailExists = await User.findOne({ email: email }).exec();
  return emailExists;
};

const registerUser = async (firstName, lastName, email, password) => {
  // hashing the password
  const salt = await bcrypt.genSalt(16);
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

module.exports = { userExists, registerUser };
