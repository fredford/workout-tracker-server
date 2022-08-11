import nodemailer from "nodemailer";

interface IOptions {
  to: string;
  subject: string;
  text: string;
}

/**
 * Utility for sending an email to the user for a reset password.
 * @param options: sender information object
 */
const sendEmail = (options: IOptions) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.text,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

export default sendEmail;
