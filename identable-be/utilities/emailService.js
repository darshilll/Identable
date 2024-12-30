const nodemailer = require("nodemailer");

const GMAIL_USER = "no-reply@identable.club";
const GMAIL_PASSWORD = "zyqz lmbb xkgs tflq";

export const sendEmail = async (entry) => {
  let { email, subject, body } = entry;

  return new Promise((resolve, reject) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: GMAIL_USER,
          pass: GMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: GMAIL_USER,
        to: email,
        subject: subject,
        html: body,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error("Error sending email:", error);
          resolve({ status: false, message: "Something went wrong" });
        } else {
          resolve({ status: true, message: "Success" });
        }
      });
    } catch (error) {
      console.error("Error sending email:", error);
      resolve({ status: false, message: "Something went wrong" });
    }
  });
};

export const sendEmail1 = async (entry) => {
  let { email, subject, body } = entry;

  return new Promise((resolve, reject) => {
    try {
      const aws = require("aws-sdk");

      const ses = new aws.SES({
        accessKeyId: process.env.AWS_ACCESS_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: "me-south-1",
        apiVersion: "2010-12-01",
      });

      const params = {
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Body: {
            Html: {
              Data: body,
            },
          },
          Subject: {
            Data: subject,
          },
        },
        Source: "no-reply@identable.club",
      };
      console.log("params = ", params);
      ses.sendEmail(params, (err, data) => {
        if (err) {
          console.error("Error sending email:", err?.message);
          resolve({ status: false, message: err?.message });
        } else {
          console.log("Email sent successfully:", data?.MessageId);
          resolve({ status: true });
        }
      });
    } catch (error) {
      console.error("Error sending email:", error);
      resolve({ status: false, message: error?.message });
    }
  });
};
