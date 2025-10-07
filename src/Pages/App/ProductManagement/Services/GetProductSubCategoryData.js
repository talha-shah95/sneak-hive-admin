import axiosInstance from '../../../../Config/axiosConfig';

const buildCategoryParams = (categoryIds = []) => {
  if (!Array.isArray(categoryIds)) return {};

  return categoryIds.reduce((params, id, index) => {
    if (id !== undefined && id !== null) {
      params[`category_ids[${index}]`] = id;
    }
    return params;
  }, {});
};

const GetProductSubCategoryData = async (categoryIds) => {
  const params = buildCategoryParams(categoryIds);

  if (!Object.keys(params).length) {
    return { data: [] };
  }

  try {
    const response = await axiosInstance.get(`/admin/get-sub-categories`, {
      params: {
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};

export default GetProductSubCategoryData;
