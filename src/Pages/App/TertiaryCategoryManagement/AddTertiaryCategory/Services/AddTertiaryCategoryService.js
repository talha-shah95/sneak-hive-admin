import axiosInstance from '../../../../../Config/axiosConfig';

const AddTertiaryCategoryService = async (data) => {
  try {
    const response = await axiosInstance.post('/admin/tertiary-categories', data, {
      requiresAuth: true,
    });
    return response?.data?.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};

export default AddTertiaryCategoryService;
