const mongoose = require('mongoose');
// validation module joi
const joi = require('@hapi/joi');

// Schema for each user in db
const UserSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

UserSchema.index({ email: 1 });

// Register validation schema using joi
const RegisterSchema = joi.object({
  firstName: joi.string().min(2).required(),
  lastName: joi.string().min(2).required(),
  email: joi.string().min(3).required().email(),
  password: joi.string().min(8).required(),
});

// assign the document in the 'user' collection in db
const user = mongoose.model('user', UserSchema);

module.exports = { user, RegisterSchema };
