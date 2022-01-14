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

exports.send = async (type, customer, items, comment, shipping) => {
  let error = [];
  if (type === "Rendelés") {
    await transporter
      .sendMail({
        from: '"Inter-Fa" <web@interfa.hu>', // sender address
        to: "toth.aron@interfa.hu", // list of receivers
        subject: "Rendelés", // Subject line
        html: `<h2>Kedves ${customer},</h2><br>
             <span>rendelését megkaptuk. Kollégánk hamarosan felveszi önnel a kapcsolatot.</span><br>
             <br><span>Köszönettel,</span><br>
             <span>Budapesti Inter-Fa Kft.</span>`, // html body
      })
      .then((info) => {
        console.log("Message sent: %s", info.messageId);
      })
      .catch((err) => {
        error.push(err);
        console.log("Email sending failed: ", err);
      });

    await transporter
      .sendMail({
        from: '"Inter-Fa" <web@interfa.hu>', // sender address
        to: "web@interfa.hu", // list of receivers
        subject: "Rendelés", // Subject line
        html: `<h2>Rendelés érkezett <b>${customer}</b> felhasználótól.</h2><br>
             <span>Rendelés típusa: ${comment}</span><br>
             <span>Szállítás: ${shipping}</span><br>
             <span>Az adatok a mellékletben találhatóak</span>`, // html body
      })
      .then((info) => {
        console.log("Message sent: %s", info.messageId);
      })
      .catch((err) => {
        error.push(err);
        console.log("Email sending failed: ", err);
      });
  } else if (type === "Árajánlat") {
    await transporter
      .sendMail({
        from: '"Inter-Fa" <web@interfa.hu>', // sender address
        to: "toth.aron@interfa.hu", // list of receivers
        subject: "Árajánlat", // Subject line
        html: `<h2>Kedves ${customer},</h2><br>
             <span>árajánlat kérelmét elküldtük. Kollégánk hamarosan felveszi önnel a kapcsolatot.</span><br>
             <br><span>Köszönettel,</span><br>
             <span>Budapesti Inter-Fa Kft.</span>`, // html body
      })
      .then((info) => {
        console.log("Message sent: %s", info.messageId);
      })
      .catch((err) => {
        error.push(err);
        console.log("Email sending failed: ", err);
      });

    await transporter
      .sendMail({
        from: '"Inter-Fa" <web@interfa.hu>', // sender address
        to: "web@interfa.hu", // list of receivers
        subject: "Árajánlat", // Subject line
        html: `<h2>Árajánlat kérelem érkezett <b>${customer}</b> felhasználótól.</h2><br>
             <span>Rendelés típusa: ${comment}</span><br>
             <span>Szállítás: ${shipping}</span><br>
             <span>Az adatok a mellékletben találhatóak</span>`, // html body
      })
      .then((info) => {
        console.log("Message sent: %s", info.messageId);
      })
      .catch((err) => {
        error.push(err);
        console.log("Email sending failed: ", err);
      });
  }
  return error;
};
