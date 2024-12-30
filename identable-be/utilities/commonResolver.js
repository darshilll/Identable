import Message from "./messages";
import { successAction, failAction } from "../utilities/response";
export default async function (req, res, next) {
  let {
    body = {},
    user = {},
    query = {},
    params = {},
    files = [],
    headers,
    isAdmin,
  } = req;
  try {
    const {
      isRequestValidateRequired = false,
      schemaValidate = {},
      isDataDownload = false,
      downloadFileName,
    } = this;
    if (isRequestValidateRequired) {
      const { error = null, value = {} } = schemaValidate.validate(body);
      if (error)
        return res
          .status(400)
          .json(
            failAction(
              error.details[0].message.toString().replace(/[\""]+/g, "")
            )
          );
      body = { ...body, ...value };
    }
    this["modelService"]({
      body,
      user,
      query,
      params,
      files,
      headers,
      isAdmin,
    }).then(
      (success) => {
        if (isDataDownload) {
          res.attachment(downloadFileName);
          return res.status(200).send(success);
        }
        if (success?.isHeaderSet) {
          for (let key in success.headerValue) {
            res.setHeader(key, success.headerValue[key]);
          }
          delete success.isHeaderSet;
          delete success.headerValue;
        }
        return res
          .status(200)
          .json(successAction(success, Message.success));
      },
      (error) => {
        console.error("than catch error=>", req.originalUrl, error);
        let errorMessage = Message.systemError;
        if (error && error.message) {
          errorMessage = Message[error.message]
            ? Message[error.message]
            : error.message;
        }
        return res.status(400).json(failAction(errorMessage));
      }
    );
  } catch (e) {
    console.error("catch block error=>", req.originalUrl, e);
    res.status(400).json(failAction(Message.systemError));
  }
}
