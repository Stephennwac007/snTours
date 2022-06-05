const nodemailer = require("nodemailer");

const sendEmail = async(options) => {
  // creating the transporter instance
  // for gmail, activate 'less secure app' option
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // defining the email options
  const mailOptions = {
    from: "Stephen Nwachukwu <hello@stephennwac.io>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // actually send the email
  await transporter.sendMail(mailOptions)
};

module.exports = sendEmail;
