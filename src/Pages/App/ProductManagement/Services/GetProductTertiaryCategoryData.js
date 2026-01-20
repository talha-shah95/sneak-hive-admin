import axiosInstance from '../../../../Config/axiosConfig';

const buildCategoryParams = (subCategoryIds = []) => {
  if (!Array.isArray(subCategoryIds)) return {};

  return subCategoryIds.reduce((params, id, index) => {
    if (id !== undefined && id !== null) {
      params[`sub_category_ids[${index}]`] = id;
    }
    return params;
  }, {});
};

const GetProductTertiaryCategoryData = async (subCategoryIds) => {
  const params = buildCategoryParams(subCategoryIds);

  if (!Object.keys(params).length) {
    return { data: [] };
  }

  try {
    const response = await axiosInstance.get(`/admin/get-tertiary-categories`, {
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

export default GetProductTertiaryCategoryData;
