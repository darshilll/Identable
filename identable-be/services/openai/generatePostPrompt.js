import dbService from "../../utilities/dbService";
import { createPostPrompt } from "../../utilities/openAi";
const ObjectId = require("mongodb").ObjectID;

export const generatePostPrompt = async (entry) => {
  try {
    let { settingData, pageData, customTopic } = entry;

    //Page
    let designation = pageData?.designation || "";

    // Settings
    let formality = settingData?.formality || "";
    let tone = settingData?.tone || {};
    let language = settingData?.language || "";
    let chatGPTVersion = settingData?.chatGPTVersion || "4";
    let targetAudience = settingData?.targetAudience || [];
    targetAudience = targetAudience?.join(" OR ");
    let objective = settingData?.objective || "";
    let callOfAction = settingData?.callOfAction || "";
    let pointOfView = settingData?.pointOfView || "";
    let about = settingData?.about || "";

    let sellType = settingData?.sellType || "";
    let website = settingData?.website || "";

    let topic = customTopic;

    let aiToneArray = Object.keys(tone).filter(function (key) {
      return tone[key] === true;
    });

    let aiTone = aiToneArray.map((item) => `${item}`).join(", ");

    let prompt = "";

    if (pageData?.type == "page") {
      prompt = `Act as an expert digital marketer with background [${about}] Your Task is to generate a LinkedIn post using these topic [${topic}] and promoting LinkedIn post for ethical selling of [${sellType}] to the target audience [${targetAudience}] posts should be talking about the pain points these target audience face as the Point of View being [${objective}], and the post is intended to attract target audience by educating them with their pain points. The call to action is to [${callOfAction}]. Posts should be written in [${language}]. The tone of your writing should be [${aiTone}], and the level of formality should be [${formality}] and provide an authentic and professional touch. Ensure each post is unique in its topic and provides informative and engaging content showcasing my in-depth knowledge and keen interest in the profession, expertise and keywords outlined above. Also, encourage readers to comment and share the post if they find it valuable. Add relevant hashtags. 
- Use an attention-grabbing headline that directly addresses the pain points. 
- Explain how your [${pageData?.name}] [${sellType}] solves these issues.
-Encourage your audience to take a specific action, such as visiting your ${website}, signing up for a demo, or contacting your sales team.`;
    } else {
      prompt = `Act as an expert [${designation}] with background ${about}.] Your Task is to generate a LinkedIn post using these topic [${topic}] as the Point of View being [${pointOfView}], The target audience is [${targetAudience}], and the post is intended to [${objective}]. The call to action is to [${callOfAction}]. Posts should be written in [${language}]. The tone of your writing should be [${aiTone}], and the level of formality should be [${formality}] and provide an authentic and personal touch.
  
  Ensure each post is unique in its topic and provides informative and engaging content showcasing my in-depth knowledge and keen interest in the profession, expertise and keywords outlined above. Also, encourage readers to comment and share the post if they find it valuable. Add relevant hashtags.`;
    }

    const result = await createPostPrompt({
      prompt: prompt,
      chatGPTVersion: chatGPTVersion,
    });

    return result
      ?.replace(/\*/g, "")
      ?.replace(/Headline:/g, "")
      ?.replace(/Headline/g, "")
      ?.replace(/Hello Everyone!,/g, "")
      ?.replace(/Hello Everyone!/g, "")
      ?.replace(/Hello Everyone/g, "")
      ?.replace(/Title/g, "")
      ?.replace(/Title:/g, "")
      ?.replace(/\[here\]/g, "");
  } catch (error) {
    console.error("generatePostPrompt error = ", error);
    return null;
  }
};
