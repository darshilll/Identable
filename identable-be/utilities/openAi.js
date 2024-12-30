import OpenAI from "openai";
import { fixInvalidJSON } from "./fixInvalidJSON";
import { jsonrepair } from "jsonrepair";
const axios = require("axios");
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const createCommonPrompt = async (entry) => {
  let { prompt, chatGPTVersion } = entry;

  return new Promise(async function (resolve, reject) {
    try {
      let param = {
        model: "gpt-4", //chatGPTVersion == "4" ? "gpt-4" : "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        max_tokens: 2048,
      };
      const response = await openai.chat.completions.create(param);
      let responseObject = {};

      if (response?.choices?.length > 0) {
        if (response?.choices[0]?.message?.content) {
          let contentStr = response?.choices[0]?.message?.content;
          contentStr = contentStr?.replace(/^```json|```$/g, "");
          let jsonObject = {};
          try {
            jsonObject = JSON.parse(contentStr);
          } catch (error) {
            try {
              const cleanedJsonString = await fixInvalidJSON(contentStr);
              const repaireJonString = jsonrepair(cleanedJsonString);
              jsonObject = JSON.parse(repaireJonString);
            } catch (error) {
              console.error("contentStr = ", contentStr);
              console.error("prompt = ", prompt);
              console.error("chatGPTVersion = ", chatGPTVersion);
              console.error("prompt after string clean json error = ", error);
            }
          }

          jsonObject = formatOpanAiResponse(jsonObject);
          if (Array.isArray(jsonObject)) {
            responseObject = {
              data: jsonObject,
            };
          } else if (typeof jsonObject === "object") {
            responseObject = jsonObject;
          }
        }
      }

      resolve(responseObject);
    } catch (error) {
      console.error("createCommonPrompt error = ", error);
      resolve(null);
    }
  });
};

export const formatOpanAiResponse = (input) => {
  if (Array.isArray(input)) {
    return input?.map((item) => formatOpanAiResponse(item));
  } else if (typeof input === "object") {
    const result = {};
    for (const key in input) {
      if (input?.hasOwnProperty(key)) {
        const capitalizedKey = key?.toLowerCase();
        result[capitalizedKey] = formatOpanAiResponse(input[key]);
      }
    }
    return result;
  }
  return input;
};

export const createNewsSummary = async (entry) => {
  let { prompt, chatGPTVersion } = entry;

  return new Promise(async function (resolve, reject) {
    try {
      let param = {
        model: "gpt-4", //chatGPTVersion == "4" ? "gpt-4" : "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        max_tokens: 2048,
      };
      const response = await openai.chat.completions.create(param);

      let contentString = "";

      if (response?.choices?.length > 0) {
        if (response?.choices[0]?.message?.content) {
          contentString = response?.choices[0]?.message?.content;
        }
      }
      resolve(contentString);
    } catch (error) {
      console.error("createCommonPrompt error = ", error);
      resolve("");
    }
  });
};

export const createPostPrompt = async (entry) => {
  let { prompt, chatGPTVersion, postNumber, wordRange = "300 to 1000" } = entry;

  return new Promise(async function (resolve, reject) {
    try {
      let param = {
        model: "gpt-4", //chatGPTVersion == "4" ? "gpt-4" : "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a Social Media Content expert. Your task is to create one original and engaging long-form or short-form posts, in between ${wordRange} words. Follow these detailed instructions:

1. Structure and Format:
   - Use ascending or descending unordered lists.
   - Use dashes for bullet points.
   - Include subheaders to organize the content.
   - Utilize whitespace effectively to enhance readability.
   - Incorporate lists and FAQs where possible.
   - Ensure the first 210 characters are particularly compelling as a hookup.

2. Content Design:
   - Pay attention to the overall design of the post.
   - Start with one-line hooks to capture attention.
   - Focus on the user's profession, expertise, and relevant keywords.
   - Incorporate hashtags related to the content, such as #hookup and other relevant hashtags.
   - Use whitespace strategically to make the content more readable and visually appealing.

3. Engagement:
   - Incorporate reasonable emojis to make the posts more engaging.
   - Use meaningful and relevant hashtags to increase engagement and drive brand awareness. Avoid overusing hashtags and ensure they are specific to the content.

Ensure the tone is professional yet approachable, and the content is tailored to the target audience's interests and needs.
- Do not echo my command or parameters.
            `,
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 2048,
        top_p: 0.8,
        frequency_penalty: 0.3,
        presence_penalty: 0.6,
      };

      const response = await openai.chat.completions.create(param);
      let contentString = "";

      if (response?.choices?.length > 0) {
        if (response?.choices[0]?.message?.content) {
          contentString = response?.choices[0]?.message?.content;
        }
      }
      resolve(contentString);
      // let responseObject = {};

      // if (response?.choices?.length > 0) {
      //   if (response?.choices[0]?.message?.content) {
      //     let contentStr = response?.choices[0]?.message?.content;
      //     contentStr = contentStr?.replace(/^```json|```$/g, "");
      //     console.log("contentStr = ", contentStr);
      //     let jsonObject = {};
      //     try {
      //       jsonObject = JSON.parse(contentStr);
      //     } catch (error) {
      //       try {
      //         const cleanedJsonString = await fixInvalidJSON(contentStr);
      //         const repaireJonString = jsonrepair(cleanedJsonString);
      //         jsonObject = JSON.parse(repaireJonString);
      //       } catch (error) {
      //         console.error("contentStr = ", contentStr);
      //         console.error("prompt = ", prompt);
      //         console.error("chatGPTVersion = ", chatGPTVersion);
      //         console.error("prompt after string clean json error = ", error);
      //       }
      //     }

      //     jsonObject = formatOpanAiResponse(jsonObject);
      //     if (Array.isArray(jsonObject)) {
      //       responseObject = {
      //         data: jsonObject,
      //       };
      //     } else if (typeof jsonObject === "object") {
      //       responseObject = jsonObject;
      //     }
      //   }
      // }

      // resolve(responseObject);
    } catch (error) {
      console.error("createCommonPrompt error = ", error);
      resolve("");
    }
  });
};

export const createPostTopicSummary = async (entry) => {
  let { prompt, chatGPTVersion } = entry;

  return new Promise(async function (resolve, reject) {
    try {
      let param = {
        model: "gpt-4", // chatGPTVersion == "4" ? "gpt-4" : "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 2048,
        top_p: 0.8,
        frequency_penalty: 0.3,
        presence_penalty: 0.6,
      };
      const response = await openai.chat.completions.create(param);

      let contentString = "";

      if (response?.choices?.length > 0) {
        if (response?.choices[0]?.message?.content) {
          contentString = response?.choices[0]?.message?.content;
        }
      }
      resolve(contentString);
    } catch (error) {
      console.error("createCommonPrompt error = ", error);
      resolve("");
    }
  });
};

export const createCommonPrompt2 = async (entry) => {
  let { prompt, chatGPTVersion } = entry;

  return new Promise(async function (resolve, reject) {
    try {
      let param = {
        model: "gpt-4", //chatGPTVersion == "4" ? "gpt-4" : "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 2048,
        top_p: 0.8,
        frequency_penalty: 0.3,
        presence_penalty: 0.6,
      };
      const response = await openai.chat.completions.create(param);
      let responseObject = {};

      if (response?.choices?.length > 0) {
        if (response?.choices[0]?.message?.content) {
          let contentStr = response?.choices[0]?.message?.content;
          contentStr = contentStr?.replace(/^```json|```$/g, "");
          let jsonObject = {};
          try {
            jsonObject = JSON.parse(contentStr);
          } catch (error) {
            try {
              const cleanedJsonString = await fixInvalidJSON(contentStr);
              const repaireJonString = jsonrepair(cleanedJsonString);
              jsonObject = JSON.parse(repaireJonString);
            } catch (error) {
              console.error("contentStr = ", contentStr);
              console.error("prompt = ", prompt);
              console.error("chatGPTVersion = ", chatGPTVersion);
              console.error("prompt after string clean json error = ", error);
            }
          }

          jsonObject = formatOpanAiResponse(jsonObject);
          if (Array.isArray(jsonObject)) {
            responseObject = {
              data: jsonObject,
            };
          } else if (typeof jsonObject === "object") {
            responseObject = jsonObject;
          }
        }
      }

      resolve(responseObject);
    } catch (error) {
      console.error("createCommonPrompt2 error = ", error);
      resolve(null);
    }
  });
};

export const generateImage = async (entry) => {
  let { prompt, chatGPTVersion, size } = entry;

  return new Promise(async function (resolve, reject) {
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: size,
      });
      resolve(response);
    } catch (error) {
      console.error("generateImage error = ", error);
      resolve(null);
    }
  });
};

export const generateArticleOpenAI = async (entry, res) => {
  let { prompt } = entry;

  return new Promise(async function (resolve, reject) {
    try {
      let param = {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        max_tokens: 2048,
        stream: true,
      };

      // Make the request using axios for streaming
      const response = await axios({
        method: "post",
        url: "https://api.openai.com/v1/chat/completions",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        data: param,
        responseType: "stream",
      });

      // Set headers for Server-Sent Events (SSE)
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Handle the streaming response
      let accumulatedData = "";
      let openBracesCount = 0;

      response.data.on("data", (chunk) => {
        const lines = chunk.toString().split("\n");
        for (const line of lines) {
          const trimmedLine = line.trim();

          // Skip empty lines and the "[DONE]" marker
          if (trimmedLine === "" || trimmedLine === "data: [DONE]") continue;

          // Remove the "data: " prefix and add the line to accumulatedData
          const dataPart = trimmedLine.replace(/^data: /, "");
          accumulatedData += dataPart;

          // Update brace count to check for full JSON structure
          for (const char of dataPart) {
            if (char === "{") openBracesCount++;
            if (char === "}") openBracesCount--;
          }

          // Only attempt parsing if braces are balanced
          if (openBracesCount === 0) {
            try {
              let content =
                JSON.parse(accumulatedData).choices[0]?.delta?.content;

              // If parsing succeeds, send content to the client
              if (content) {
                if (content?.indexOf("\n") != -1) {
                  content = content.replace(/^\n/, "<br>");
                }

                // Add a newline character explicitly
                res.write(`data: ${content}\n\n`);
              }

              // Reset accumulated data and brace count after successful parse
              accumulatedData = "";
            } catch (error) {
              console.log("JSON parse error, awaiting more data...", error);
            }
          }
        }
      });
      response.data.on("end", () => {
        console.log("end...");
        res.write("data: [DONE]\n\n");
        res.end(); // End the connection when the stream is done
        resolve(true);
      });

      response.data.on("error", (error) => {
        console.error("Error during streaming:", error);
        res.write("data: [ERROR]\n\n");
        res.end();
        resolve(false);
      });
    } catch (error) {
      console.error("createCommonPrompt error = ", error);
      res.write("data: [ERROR]\n\n");
      res.end();
      resolve(false);
    }
  });
};
