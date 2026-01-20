import axiosInstance from '../../../../Config/axiosConfig';

const GetActiveSubCategories = async () => {
  try {
    const response = await axiosInstance.get(`/admin/get-sub-categories`);
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};

export default GetActiveSubCategories;
