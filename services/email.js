const nodemailer = require('nodemailer');
const { emailConfig } = require('../helpers/email');

const sendEmail = async (email, firstName, link) => {
  const mailOptions = {
    from: 'info@node-mongo-signup-verification-api.com',
    to: email,
    subject: 'Email verification',
    html: `<h1>Hello, ${firstName} </h1><p>You registered an account on Pharma, 
        before being able to use your account you need to verify that this is your email address by 
        clicking here:</p> <a href="${link}">Verify your email</a>`,
  };
  const transporter = nodemailer.createTransport(emailConfig);
  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
