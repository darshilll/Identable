const ogs = require("open-graph-scraper");

export const getLinkPreview = async (entry) => {
  let {
    body: { url },
  } = entry;

  try {
    const options = { url };

    const { result } = await ogs(options);

    if (result.success) {
      let imageUrl = "";
      let image = {};
      if (result.ogImage?.length > 0) {
        imageUrl = result.ogImage[0]?.url;
        image = result.ogImage[0];
      }
      return {
        title: result.ogTitle,
        description: result.ogDescription,
        imageUrl: imageUrl,
        image: image,
        url: result.requestUrl,
      };
    } else {
      return { url };
    }
  } catch (error) {
    console.error("error = ", error);
    return { url };
  }
};
