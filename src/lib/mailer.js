const nodemailer = require("nodemailer");
const AWS = require("aws-sdk");
// configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});
// create Nodemailer SES transporter
let transporter = nodemailer.createTransport({
  SES: new AWS.SES({
    apiVersion: "2010-12-01",
  }),
});
// send some mail
exports.send = ({ to, subject, text }) => {
  transporter.sendMail(
    {
      from: `Stream Team no-reply@${process.env.MAIL}`,
      to,
      subject,
      html: `
      ${text}
      <br>
      <i>Энэхүү имэйл нь автоматаар илгээгдсэн учир хариу бичих шаардлагагүй</i>`,
    },
    (err, info) => {
      if (err) {
        console.log(err);
        return false;
      } else {
        return info.messageId;
      }
    }
  );
};
