import dbService from "../../utilities/dbService";

export const retryJobRequest = async (entry) => {
  let {
    body: { jobRequestId },
    user: { _id },
  } = entry;

  const jobData = await dbService.findOneRecord("JobRequestModel", {
    _id: ObjectId(jobRequestId),
  });

  if (!jobData) {
    throw new Error("Invalid Job Request Id");
  }

  if (jobData?.status == "success") {
    throw new Error("Job already successfully completed");
  }

  return "Job triggered successfully";
};
