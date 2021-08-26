// validation module joi
const joi = require('joi');
const jwt = require('jsonwebtoken');

// Register validation schema using joi
const RegisterSchema = joi.object({
  firstName: joi.string().min(2).required().trim(),
  lastName: joi.string().min(2).required().trim(),
  email: joi.string().min(3).required().email().trim(),
  password: joi.string().min(8).required().trim(),
  confirmPassword: joi.string().valid(joi.ref('password')).required().trim(),
});

// Login validation schema using joi
const LoginSchema = joi.object({
  email: joi.string().min(3).required().email().trim(),
  password: joi.string().min(8).required().trim(),
});

// Reset validation schema using joi
const ResetPasswordSchema = joi.object({
  token: joi.string().required(),
  password: joi.string().min(8).required().trim(),
  confirmPassword: joi.string().valid(joi.ref('password')).required().trim(),
});

// create the token for the login
const createToken = async (user) => {
  const token = await jwt.sign({ _id: user.id }, process.env.SECRET_TOKEN);
  return token;
};

module.exports = { RegisterSchema, LoginSchema, createToken, ResetPasswordSchema };
