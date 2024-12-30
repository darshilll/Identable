import dbService from "../../utilities/dbService";
import { generateAIImageAction } from "./generateAIImageAction";
import { checkCredit } from "../creditUsage/checkCredit";
import { updateCreditUsage } from "../creditUsage/updateCreditUsage";
import { CREDIT_TYPE } from "../../utilities/constants";

export const generateImage = async (entry) => {
  let {
    body: { topic, size, imageStyle },
    user: { _id, currentPageId },
  } = entry;

  await checkCredit({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.AI_IMAGE,
  });

  let imageStylePrompt = "";
  if (imageStyle == "Photography") {
    imageStylePrompt =
      "cinematic photo. 35mm photograph, film, bokeh, professional, 4k, highly detailed";
  } else if (imageStyle == "Analog Film") {
    imageStylePrompt =
      "analog film photo, faded film, desaturated, 35mm photo, grainy, vignette, vintage, Kodachrome, Lomography, stained, highly detailed, found footage";
  } else if (imageStyle == "Anime") {
    imageStylePrompt =
      "anime artwork, anime style, key visual, vibrant, studio anime, highly detailed";
  } else if (imageStyle == "Digital Art") {
    imageStylePrompt =
      "concept art. digital artwork, illustrative, painterly, matte painting, highly detailed";
  } else if (imageStyle == "Fantasy Art") {
    imageStylePrompt =
      "ethereal fantasy concept art of. magnificent, celestial, ethereal, painterly, epic, majestic, magical, fantasy art, cover art, dreamy";
  } else if (imageStyle == "Vaporware") {
    imageStylePrompt =
      "vaporwave synthwave style. cyberpunk, neon, vibes, stunningly beautiful, crisp, detailed, sleek, ultramodern, high contrast, cinematic composition";
  } else if (imageStyle == "Isometric") {
    imageStylePrompt =
      "isometric style. vibrant, beautiful, crisp, detailed, ultra detailed, intricate";
  } else if (imageStyle == "Low Poly") {
    imageStylePrompt =
      "low-poly style. ambient occlusion, low-poly game art, polygon mesh, jagged, blocky, wireframe edges, centered composition";
  } else if (imageStyle == "Claymation") {
    imageStylePrompt =
      "Claymation style. sculpture, clay art, centered composition, play-doh";
  } else if (imageStyle == "Origami") {
    imageStylePrompt =
      "origami style. paper art, pleated paper, folded, origami art, pleats, cut and fold, centered composition";
  } else if (imageStyle == "Line Art") {
    imageStylePrompt =
      "line art drawing. professional, sleek, modern, minimalist, graphic, line art, vector graphics";
  } else if (imageStyle == "Pixel Art") {
    imageStylePrompt =
      "pixel-art. low-res, blocky, pixel art style, 16-bit graphics";
  } else if (imageStyle == "Texture") {
    imageStylePrompt = "texture. top down close-up, video game";
  }
  let prompt = `Create an image that visually represents topic is [${topic}]. ${imageStylePrompt}`;

  let image = await generateAIImageAction({
    userId: _id,
    pageId: currentPageId,
    size: size,
    promptVal: prompt,
  });

  if (!image) {
    throw new Error("Failed to generate image. Please try again.");
  }

  // ================ Update Credit ================

  await updateCreditUsage({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.AI_IMAGE,
  });

  return image;
};
