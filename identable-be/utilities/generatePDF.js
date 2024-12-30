const PDFDocument = require("pdfkit");
const fs = require("fs");
const axios = require("axios");
const AWS = require("aws-sdk");

const accessKeyId = process.env.AWS_ACCESS_ID;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const bucketName = process.env.BUCKET_NAME;
const endpoint = process.env.BUCKET_ENDPOINT;

AWS.config.update({
  accessKeyId,
  secretAccessKey,
  endpoint,
});

const s3 = new AWS.S3();

export const generatePDF = async (entry) => {

  let { userId, user, titlesAndDescriptions, carouselData } = entry;

  const backgrounColor = carouselData?.backend?.backgroundColor;
  const textColor = carouselData?.backend?.textColor;
  const isBgImage = carouselData?.backend?.isBgImage;
  const isBgPattern = carouselData?.backend?.isBgPattern;
  const bgPattern = carouselData?.backend?.bgPattern;
  const bgimage = carouselData?.backend?.bgimage;
  const profileLayout = carouselData?.backend?.profileLayout;
  const textAlign = carouselData?.backend?.textAlign;
  const isBox = carouselData?.backend?.isBox;
  const boxColor = carouselData?.backend?.boxColor;

  return new Promise(async function (resolve, reject) {
    try {
      const doc = new PDFDocument({
        size: [400, 410],
        margin: 0,
      });
      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));

      doc.on("end", async () => {
        try {
          const pdfData = Buffer.concat(buffers);

          const params = {
            Bucket: bucketName,
            Key: userId + "/document_" + Date.now() + ".pdf",
            Body: pdfData,
            ContentType: "application/pdf",
            ACL: "public-read",
          };

          const data = await s3.upload(params).promise();

          resolve(data.Location);
        } catch (err) {
          console.error("Error uploading file:", err);
          resolve("");
        }
      });

      const userImageBuffer = await fetchImage(user.imageUrl);
      const backgroundPatternBuffer = await fetchImage(bgPattern);
      const backgroundImageBuffer = await fetchImage(bgimage);

      const addPageBackgroundPattern = () => {
        if (isBgImage) {
          doc.image(backgroundImageBuffer, 0, 0, {
            width: doc.page.width,
            height: doc.page.height,
          });
        } else {
          doc.rect(0, 0, doc.page.width, doc.page.height).fill(backgrounColor); // Set background color
        }

        doc.fillColor(textColor); // Set text color

        if (isBgPattern) {
          doc.image(backgroundPatternBuffer, 0, 0, {
            width: doc.page.width,
            height: doc.page.height,
          }); // Draw the background image on each page
        }

        if (isBox) {
          doc.opacity(0.6);
          doc
            .roundedRect(20, 40, doc.page.width - 40, doc.page.height - 100, 10)
            .fill(boxColor);
          doc.opacity(1);
        }
      };

      const xPos = 30;

      const addProfile = () => {
        // Draw user image as a circle

        let profileY = 50;
        if (profileLayout == "bottomLeft") {
          profileY = doc.page.height - 30;
        }

        doc.save();
        doc.circle(50, profileY, 20).clip();
        doc.image(userImageBuffer, 30, profileY - 20, {
          width: 40,
          height: 40,
        });
        doc.restore();

        // User name and handler
        doc.fontSize(14).text(user.name, 75, doc.page.height - 36);
        // doc.fontSize(36).text(user.name, 75, profileY - 6, { align: "left" });

        // doc.fontSize(16).text(user.handler, 450, 65);
      };

      // Add content slides
      let main = titlesAndDescriptions[0]?.main;

      addPageBackgroundPattern();
      doc.moveDown(2);
      doc.fillColor(textColor);
      doc.fontSize(36).text(main, xPos, 110, {
        align: textAlign,
        width: doc.page.width - 60,
      });

      addProfile();

      for (let i = 1; i < titlesAndDescriptions?.length - 1; i++) {
        const { title, description } = titlesAndDescriptions[i];
        doc.addPage();
        addPageBackgroundPattern();
        doc.moveDown(2);
        doc.fillColor(textColor);
        doc.fontSize(20).text(title, xPos, 80, {
          align: textAlign,
          width: doc.page.width - 60,
        });
        doc.moveDown(1);
        doc.fillColor(textColor);
        doc
          .fontSize(16)
          .text(description, xPos, 130, { width: doc.page.width - 60 });

        addProfile();
      }

      doc.addPage();
      addPageBackgroundPattern();
      doc.moveDown(2);

      const footer =
        titlesAndDescriptions[titlesAndDescriptions.length - 1]?.footer;
      doc.fillColor(textColor);
      doc.fontSize(34).text(footer, xPos, 130, {
        align: textAlign,
        width: doc.page.width - 60,
      });
      doc.moveDown(1);
      addProfile();
      doc.end();
    } catch (error) {
      console.error("error 1 = ", error);
      resolve("");
    }
  });
};

async function fetchImage(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return response.data;
}
