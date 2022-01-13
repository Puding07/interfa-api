const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 25,
  secure: false, // true for 465, false for other ports
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.send = async () => {
  await transporter
    .sendMail({
      from: '"Fred Foo 👻" <web@interfa.hu>', // sender address
      to: "toth.aron@interfa.hu", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world? ✔ Fred Foo 👻", // plain text body
      html: "<b>Hello world? ✔ Fred Foo 👻</b>", // html body
    })
    .then((info) => {
      console.log("Message sent: %s", info.messageId);
    })
    .catch((err) => console.log("Email sending failed: ", err));

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};
