import axiosInstance from '../../../../Config/axiosConfig';

const GetActiveCategories = async () => {
  try {
    const response = await axiosInstance.get(`/admin/get-categories`);
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};

export default GetActiveCategories;
