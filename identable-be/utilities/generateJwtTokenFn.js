import { failAction } from "./response";
import jwt from "jsonwebtoken";

const jwtAlgo = process.env.JWT_ALGO;
const jwtKey = process.env.JWT_KEY;
export const generateJwtTokenFn = async (userIdObj) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      userIdObj,
      jwtKey,
      { algorithm: jwtAlgo, expiresIn: "365d" },
      function (err, encode) {
        if (err) {
          resolve("");
        } else {
          resolve(encode);
        }
      }
    );
  });
};
