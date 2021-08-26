const nodemailer = require('nodemailer');
const { emailConfig } = require('../helpers/email');

const sendVerifyEmail = async (user, origin) => {
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

const sendResetEmail = async (user, origin) => {
  const resetUrl = `${origin}/auth/reset-password?token=${user.resetToken}`;
  const mailOptions = {
    from: 'info@node-mongo-signup-verification-api.com',
    to: user.email,
    subject: 'Reset password',
    html: `<h1>Hello, ${user.firstName} </h1>
        <p>You have requested to reset your password. We cannot simply send you your old password. 
        A unique link to reset your password has been generated for you. To reset your password, 
        click the following link:</p> <a href="${resetUrl}">Reset your password</a>`,
  };
  const transporter = nodemailer.createTransport(emailConfig);
  await transporter.sendMail(mailOptions);
};

const sendResetSuccessEmail = async (user, origin) => {
  const mailOptions = {
    from: 'info@node-mongo-signup-verification-api.com',
    to: user.email,
    subject: 'Reset password successfully',
    html: `<h1>Hello, ${user.firstName} </h1>
        <p>Your password changed successfully. You can now login:</p> <a href="${origin}">Pharma React</a>`,
  };
  const transporter = nodemailer.createTransport(emailConfig);
  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerifyEmail, sendResetEmail, sendResetSuccessEmail };
