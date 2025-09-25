import axiosInstance from '../../../../../Config/axiosConfig';

const ChangeProductStatus = async (id) => {
  try {
    const response = await axiosInstance.post(
      `/vendor/product/${id}/toggle-status`,
      {},
      {
        requiresAuth: true,
      }
    );
    const message = response?.data?.message;
    return {
      message,
    };
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};

export default ChangeProductStatus;
