import axiosInstance from '../../../../../Config/axiosConfig';

const AddBrandService = async (data) => {
  try {
    const response = await axiosInstance.post('/admin/brands', data, {
      requiresAuth: true,
    });
    return response?.data?.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};

export default AddBrandService;
