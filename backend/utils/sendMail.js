const nodemailer = require("nodemailer");
const dotenv = require("dotenv")

// setting up config file
dotenv.config({path : "backend/config/config.env"})

const sendMail = async options => {
  var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    }
  });

      const message = {
          from : `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
          to : options.email,
          subject : options.subject,
          text : options.message,
      }

      await transport.sendMail(message)
}

module.exports = sendMail;