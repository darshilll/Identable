import dbService from "../../utilities/dbService";
import { pagenationFn } from "../../utilities/pagination";

export const getAudioList = async (entry) => {
  let {
    user: { _id },
  } = entry;


  let aggregate = [
   
    {
      $project: {
        _id: 1,
        language: 1,
        accent: 1,
        audioUrl: 1,
        gender: 1,
        audioId:1,                        
        name:1
      },
    },
  ];

  const data = await dbService.aggregateData("AudiodModel", aggregate);

  return data;
};
