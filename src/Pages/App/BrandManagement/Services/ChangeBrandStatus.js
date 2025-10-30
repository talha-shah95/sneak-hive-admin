import axiosInstance from '../../../../Config/axiosConfig';

const ChangeBrandStatus = async (id) => {
  try {
    const response = await axiosInstance.post(
      `/admin/brands/${id}/status`,
      {},
      {
        requiresAuth: true,
      }
    );
    const message =
      response.data.data.is_active == 1
        ? 'Brand has been activated successfully!'
        : 'Brand has been inactivated successfully!';
    return {
      message,
    };
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};

export default ChangeBrandStatus;
