const ObjectId = require("mongodb").ObjectID;
import dbService from "../../utilities/dbService";
import { failAction } from "../../utilities/response";
import Message from "../../utilities/messages";

export default async function (req, res, next) {
  try {
    const { body, headers, path, originalUrl, query } = req;
    const { authorization, host } = headers;
    const data = {};
    data.format = "request";
    data.path = path;
    data.body = body;
    data.originalUrl = originalUrl;
    data.headers = { authorization, host, userAgent: headers["user-agent"] };

    let Authorization =
      req["headers"]["Authorization"] || req["headers"]["authorization"];
    if (!Authorization) {
      if (query?.token) {
        Authorization = query?.token;
      } else {
        return res
          .status(401)
          .json(failAction("Authorization not found!", 401));
      }
    }

    let filter = { loginToken: Authorization };

    let userData = await dbService.findOneRecord("UserModel", filter, {
      _id: 1,
      timezone: 1,
      chatGPTVersion: 1,
      currentPageId: 1,
      isDsahboardLoaded: 1,
    });

    if (!userData)
      return res.status(401).json(failAction(Message.tokenExpired, 401));

    let userTimezone = "America/New_York";
    if (userData.timezone) {
      userTimezone = userData.timezone;
    }
    let userInfo = {
      _id: userData._id,
      userTimezone: userTimezone,
      chatGPTVersion: userData?.chatGPTVersion,
      currentPageId: userData?.currentPageId,
      isDsahboardLoaded: userData?.isDsahboardLoaded,
    };

    req.user = userInfo;
    next();
  } catch (error) {
    return res.status(401).json(failAction(Message.tokenExpired, 401));
  }
}
