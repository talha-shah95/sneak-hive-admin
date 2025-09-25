import axiosInstance from '../../../../../../Config/axiosConfig';

const updateProductService = async ({ id, data }) => {
  try {
    const response = await axiosInstance.post(
      `/vendor/product/${id}/update`,
      data,
      {
        requiresAuth: true,
      }
    );
    return response?.data?.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};

export default updateProductService;
