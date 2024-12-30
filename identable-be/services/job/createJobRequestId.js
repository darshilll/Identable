import dbService from "../../utilities/dbService";

export const createJobRequestId = async (entry) => {
  try {
    let { userId } = entry;

    let obj = {
      userId: userId,
      status: "created",
    };

    const createdData = await dbService.createOneRecord("JobRequestModel", obj);

    return createdData?._id;
  } catch (error) {
    console.error("createJobRequestId error = ", error);
    return null;
  }
};
