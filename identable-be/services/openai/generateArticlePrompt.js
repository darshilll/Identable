import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS } from "../../utilities/constants";
import { createCommonPrompt, createNewsSummary } from "../../utilities/openAi";

const ObjectId = require("mongodb").ObjectID;

export const generateArticleTopicPrompt = async (entry) => {
  let { chatGPTVersion, topic } = entry;

  let prompt = `Act as an SEO expert. Create a table that contains article ideas to build topic authority for my keyword or topic. The table should contain six rows where the first row is the header with column names. The other five rows should be ideas for the topics related to the main topic or keyword, which should give me a boost from these supporting articles. The output should be in English.
  The columns should be:
  1. Title for the article with no more than 45 characters,
  2. Description of the article with a maximum of 120 characters,
  3. Suggestions of the top three strategically chosen keywords for the article,
  4. Classification of the search intent using one word.
  Please create such a table for me to help me build topic authority for my website and my main article.
  [KEYWORD OR TOPIC]: [
  ${topic}
  ].
  - Do not echo my command or parameters.
  - Follow the below output pattern in the json format
  {
    "Data": [
      {
        "Title": "The Tiles Here",
        "Description": "The Description here",
        "StrategicKeywords": "The Strategic Keywords here",
        "SearchIntent": "the Search Intent here"
      }
    ]
  };`;

  const result = await createCommonPrompt({
    prompt: prompt,
    chatGPTVersion: chatGPTVersion,
  });

  return result;
};

export const generateOutlineOutputPrompt = async (entry) => {
  let { chatGPTVersion, title, description, strategicKeywords, searchIntent } =
    entry;

  let prompt = `Act as an SEO expert and generate 3 comprehensive article outlines based on the information provided below.
  Title: ${title},
  Description: ${description},
  Strategic Keywords: ${strategicKeywords},
  Search Intent: ${searchIntent}

  - Do not echo my command or parameters.
  - Follow the below output pattern in the json format
  {
    "Data": [
      {
        "Title": "The title here",
        "HeadingData": [
          {
            "H2": "H2 here",
            "H3": [
              "h3 here mutiple"
            ],
          },
          {
            "H2": "H2 here",
            "H3": [
              "h3 here mutiple"
            ],
          },
          {
            "H2": "H2 here",
            "H3": [
              "h3 here mutiple"
            ],
          },
        ]
      },
      {
        "Title": "The title here",
        "HeadingData": [
          {
            "H2": "H2 here",
            "H3": [
              "h3 here mutiple"
            ],
          },
          {
            "H2": "H2 here",
            "H3": [
              "h3 here mutiple"
            ],
          },
          {
            "H2": "H2 here",
            "H3": [
              "h3 here mutiple"
            ],
          },
        ]
      },
      {
        "Title": "The title here",
        "HeadingData": [
          {
            "H2": "H2 here",
            "H3": [
              "h3 here mutiple"
            ],
          },
          {
            "H2": "H2 here",
            "H3": [
              "h3 here mutiple"
            ],
          },
          {
            "H2": "H2 here",
            "H3": [
              "h3 here mutiple"
            ],
          },
        ]
      }
    ],
    "Conclusion": "Conclusion here",
  }`;

  const result = await createCommonPrompt({
    prompt: prompt,
    chatGPTVersion: chatGPTVersion,
  });

  return result;
};

export const generateArticlePrompt = async (entry) => {
  let { chatGPTVersion, title, headingData, conclusion } = entry;

  const output = convertArrayToString(headingData);

  let prompt = `Using html formatting, bolded words, lists and tables and FAQ's where possible generate a fairly 3000 words article based on the outline generated above for 
  H1:${title},
  ${output},
  Conclusion:${conclusion}`;

  const result = await createNewsSummary({
    prompt: prompt,
    chatGPTVersion: chatGPTVersion,
  });

  return result;
};

function convertArrayToString(arr) {
  let result = [];

  arr.forEach((item) => {
    for (let key in item) {
      if (Array.isArray(item[key])) {
        item[key].forEach((value) => {
          result.push(`${key}:${value}`);
        });
      } else {
        result.push(`${key}:${item[key]},`);
      }
    }
  });

  return result.join("\n");
}
