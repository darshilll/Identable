import dbService from "../../utilities/dbService";

export const saveJobResponseData = async (entry) => {
  try {
    let { responseData, responseError, jobRequestId } = entry;

    let obj = {
      responseData: responseData,
      responseError: responseError,
      responseAt: Date.now(),
      status: "completed",
    };

    await dbService.updateOneRecords(
      "JobRequestModel",
      { _id: jobRequestId },
      obj
    );
  } catch (error) {
    console.error("saveJobResponseData error = ", error);
  }
};
