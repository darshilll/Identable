let request = require("request");
const axios = require("axios");

export const faceAnalyzeService = async (entry) => {
  return new Promise(function (resolve, reject) {
    let { base64 } = entry;

    let body = {
      img_path: base64,
      actions: ["age", "gender"],
    };

    let options = {
      method: "POST",
      url: "https://predictor.identable.club/analyze",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + process.env.AUTOMATION_JOB_TOKEN,
      },
      body: body,
      json: true,
    };
    
    request(options, (error, response, body) => {
      try {
        if (error) {
          console.error("faceAnalyzeService error = ", error);
        } else {
          if (response) {
            resolve(response?.body);
            return;
          }
        }
      } catch (error) {
        console.error("faceAnalyzeService error = ", error);
      }
      resolve(null);
    });
  });
};

export const imageUrlToBase64 = async (imageUrl) => {
  return new Promise(async function (resolve, reject) {
    try {
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      const base64 = Buffer.from(response.data, "binary").toString("base64");
      resolve(base64);
    } catch (error) {
      console.error("imageUrlToBase64:", error);
      resolve(null);
    }
  });
};

export const validateProfilePhoto = async (imageUrl) => {
  try {
    const response = await axios.post(
        "https://predictor.identable.club/analyze",
        {
            img_path: imageUrl,
            actions: ["age", "gender"],
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${process.env.AUTOMATION_JOB_TOKEN}`,
            },
        }
    );

    const results = response.data.results;

    if (!results || results.length === 0) {
        return {
            isValid: false,
            message: "No face detected. Please upload a clearer photo.",
        };
    }

    const primaryFace = results[0];
    if (
        primaryFace.face_confidence < 0.8 ||
        results.length > 1
    ) {
        return {
            isValid: false,
            message:
                results.length > 1
                    ? "Multiple faces detected. Please upload a photo with only one face."
                    : "Face confidence is too low. Please upload a clearer photo.",
        };
    }

    return {
        isValid: true,
        message: "Profile photo is valid.",
        profilePhotoUrl: imageUrl,
    };
} catch (error) {
    return {
        isValid: false,
        message: "Failed to validate the profile photo.",
    };
}
}
