const defaultLimit = process.env.LIMIT || 20;
export const pagenationFn = (
  { sort = null, page = 1, limit = defaultLimit, holdingSort },
  defaultSortOn = "createdAt"
) => {
  if (page < 1) page = 1;
  const skip = (page - 1) * limit;
  limit = parseInt(limit);

  const sortBy = holdingSort ? { _id: 1 } : { _id: -1 };

  return {
    sortBy,
    docLimit: limit,
    noOfDocSkip: skip,
  };
};

export const paginationFn = (
  { sort = null, page = 1, limit = defaultLimit, holdingSort },
  defaultSortOn = "createdAt"
) => {
  if (page < 1) page = 1;
  const skip = (page - 1) * limit;
  limit = parseInt(limit);

  const sortBy = holdingSort ? { _id: 1 } : { _id: -1 };

  return {
    sortBy,
    docLimit: limit,
    noOfDocSkip: skip,
  };
};
