## Send a message using SES transport

```js
let nodemailer = require("nodemailer");
let aws = require("@aws-sdk/client-ses");

// configure AWS SDK
process.env.AWS_ACCESS_KEY_ID = "....";
process.env.AWS_SECRET_ACCESS_KEY = "....";
const ses = new aws.SES({
  apiVersion: "2010-12-01",
  region: "us-east-1",
});

// create Nodemailer SES transporter
let transporter = nodemailer.createTransport({
  SES: { ses, aws },
});

// send some mail
transporter.sendMail(
  {
    from: "sender@example.com",
    to: "recipient@example.com",
    subject: "Message",
    text: "I hope this message gets sent!",
    ses: {
      // optional extra arguments for SendRawEmail
      Tags: [
        {
          Name: "tag_name",
          Value: "tag_value",
        },
      ],
    },
  },
  (err, info) => {
    console.log(info.envelope);
    console.log(info.messageId);
  }
);
```

## Ubuntu

```
sudo add-apt-repository ppa:mc3man/trusty-media
sudo apt-get update
sudo apt-get install -y ffmpeg
```
