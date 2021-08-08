const nodemailer = require('nodemailer');
const { emailConfig } = require('../helpers/email');

const sendEmail = async (user, origin) => {
  const verifyUrl = `${origin}/auth/verify-email?token=${user.verificationToken}`;
  const mailOptions = {
    from: 'info@node-mongo-signup-verification-api.com',
    to: user.email,
    subject: 'Email verification',
    html: `<h1>Hello, ${user.firstName} </h1><p>You registered an account on Pharma, 
        before being able to use your account you need to verify that this is your email address by 
        clicking here:</p> <a href="${verifyUrl}">Verify your email</a>`,
  };
  const transporter = nodemailer.createTransport(emailConfig);
  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
