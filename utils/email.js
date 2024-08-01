const nodemailer = require("nodemailer");

async function sendEmail(options) {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "2679146f8a14fb",
      pass: "a4af3843aada6d",
    },
  });

  const mailOptions = {
    from: "Tomzor <miracleolaniyan@yahoo.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: '<b>Hello world?</b>'
  };
  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
