import dbService from "../../utilities/dbService";

export const saveJobRequestData = async (entry) => {
  try {
    let { jobRequestId, submitData } = entry;

    let obj = {
      requestData: submitData,
      submittedAt: Date.now(),
      status: "submiitted",
    };

    await dbService.updateOneRecords(
      "JobRequestModel",
      { _id: jobRequestId },
      obj
    );
  } catch (error) {
    console.error("saveJobRequestData error = ", error);
  }
};
