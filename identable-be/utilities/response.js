export const successAction = (data, message = "OK", type = "SUCCESS") => {
  return { statusCode: 200, data, message, type };
};

export const failAction = (
  message = "Fail",
  statusCode = 400,
  type = "ERROR"
) => {
  return { statusCode: statusCode, data: null, message, type };
};
