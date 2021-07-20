// validation module joi
const joi = require('joi');

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

module.exports = { RegisterSchema, LoginSchema };
