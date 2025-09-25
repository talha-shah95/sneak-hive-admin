import axiosInstance from '../Config/axiosConfig';

const GetProductSubCategoryData = async (categoryId) => {
  try {
    const response = await axiosInstance.get(
      `/general/sub-category/${categoryId}/list-by-category-id`,
      {
        requiresAuth: false,
      }
    );
    return response?.data?.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};

export default GetProductSubCategoryData;
