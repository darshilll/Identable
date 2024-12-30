export const fixInvalidJSON = async  (jsonString) => {
  if (!jsonString || jsonString.trim() === "") {
    return "[]";
  }
  jsonString = jsonString.trim();
  if (!jsonString.startsWith("{") && !jsonString.endsWith("}")) {
    jsonString = "{" + jsonString + "}";
  }
  else if (jsonString.startsWith("{") && !jsonString.endsWith("}")) {
    jsonString += "}";
  } else if (jsonString.startsWith("[") && !jsonString.endsWith("]")) {
    jsonString += "]";
  } else if (jsonString === "{}") {
    jsonString = "[{}]";
  } else if (jsonString === "[]") {
  } else if (jsonString.startsWith("{") && !isValidJsonObject(jsonString)) {
    jsonString = "[" + jsonString + "]";
  } else if (jsonString.startsWith("[") && !isValidJsonArray(jsonString)) {
    let objects = jsonString.split("}{").map((s, index, array) => {
      if (index !== array.length - 1) {
        return s + "}";
      } else {
        return s;
      }
    });
    jsonString = "[" + objects.join(",") + "]";
  }
  return jsonString;
};

export const isValidJsonObject = (str) => {
  try {
    JSON.parse(str);
    return str.trim().startsWith("{") && str.trim().endsWith("}");
  } catch (error) {
    return false;
  }
};

export const isValidJsonArray = (str) => {
  try {
    JSON.parse(str);
    return str.trim().startsWith("[") && str.trim().endsWith("]");
  } catch (error) {
    return false;
  }
};
