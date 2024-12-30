import dbService from "../../utilities/dbService";

export const getTheme = async (entry) => {
  try {
    let {
      user: { _id },
    } = entry;

    let aggregate = [
      {
        $match: {
          $or: [{ userId: _id }, { defaultTheme: true }],
          isDeleted: false,
        },
      },
    ];

    let theme = await dbService.aggregateData("ThemeModel", aggregate);
    if (!theme) {
      theme = [];
    }

    return theme;
  } catch (error) {
    console.error("generatePost error = ", error);
  }
};
