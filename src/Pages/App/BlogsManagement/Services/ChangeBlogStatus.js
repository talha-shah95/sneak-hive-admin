import axiosInstance from '../../../../Config/axiosConfig';

const ChangeBlogStatus = async (id) => {
  try {
    const response = await axiosInstance.post(
      `/admin/blogs/${id}/status`,
      {},
      {
        requiresAuth: true,
      }
    );
    const message =
      response.data.data.is_active == 1
        ? 'Blog has been activated successfully!'
        : 'Blog has been inactivated successfully!';
    return {
      message,
    };
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};

export default ChangeBlogStatus;
