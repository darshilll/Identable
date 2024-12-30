import dbService from "../../utilities/dbService";

export const saveJobTriggerResponse = async (entry) => {
  try {
    let { jobRequestId, jobTriggerResponse, jobTriggerError } = entry;

    let obj = {
      jobTriggerResponse: jobTriggerResponse,
      jobTriggerError: jobTriggerError,
      jobTriggerResponseAt: Date.now(),
      status: "processing",
    };

    await dbService.updateOneRecords(
      "JobRequestModel",
      { _id: jobRequestId },
      obj
    );
  } catch (error) {
    console.error("jobTriggerResponse error = ", error);
  }
};
