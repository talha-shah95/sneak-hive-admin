import axiosInstance from '../../../../../Config/axiosConfig';

const GetTertiaryCategoryDetails = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/tertiary-categories/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};

export default GetTertiaryCategoryDetails;
