import axiosInstance from '../../../../Config/axiosConfig';

const ChangeVideoStatus = async (id) => {
  try {
    const response = await axiosInstance.post(
      `/admin/videos/${id}/status`,
      {},
      {
        requiresAuth: true,
      }
    );
    const message =
      response.data.data.is_active == 1
        ? 'Video has been activated successfully!'
        : 'Video has been inactivated successfully!';
    return {
      message,
    };
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};

export default ChangeVideoStatus;
