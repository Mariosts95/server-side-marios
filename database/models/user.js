const mongoose = require('mongoose');

// Schema for each user in db
const UserSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  verificationToken: { type: String },
  resetToken: { type: String },
  verified: { type: Date },
});

UserSchema.index({ email: 1 });

// assign the document in the 'user' collection in db
const User = mongoose.model('user', UserSchema);

module.exports = { User };
