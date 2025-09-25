import axiosInstance from '../../../../../../Config/axiosConfig';

const ChangeOrderStatus = async ({ id, payload }) => {
  try {
    const response = await axiosInstance.post(
      `/vendor/order/${id}/update-status`,
      payload,
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

export default ChangeOrderStatus;
