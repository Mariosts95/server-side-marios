const emailConfig = {
  emailFrom: 'info@node-mongo-signup-verification-api.com',
  secret: process.env.SECRET_TOKEN,
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};


module.exports = { emailConfig };
