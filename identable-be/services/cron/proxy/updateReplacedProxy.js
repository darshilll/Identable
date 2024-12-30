const moment = require("moment-timezone");
import dbService from "../../utilities/dbService";
import { getReplacedProxyList } from "../../../utilities/proxyService";

export const updateReplacedProxy = async () => {
  try {

    let proxyArray = await getReplacedProxyList();

  } catch (error) {
    console.error("updateReplacedProxy error = ", error);
  }
};
