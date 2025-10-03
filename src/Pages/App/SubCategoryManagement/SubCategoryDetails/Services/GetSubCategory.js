import axiosInstance from '../../../../../Config/axiosConfig';

const GetSubCategory = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/sub-categories/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};

export default GetSubCategory;
