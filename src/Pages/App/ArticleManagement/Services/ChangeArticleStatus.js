import axiosInstance from '../../../../Config/axiosConfig';

const ChangeArticleStatus = async (id) => {
  try {
    const response = await axiosInstance.post(
      `/admin/articles/${id}/status`,
      {},
      {
        requiresAuth: true,
      }
    );
    const message =
      response.data.data.is_active == 1
        ? 'Article has been activated successfully!'
        : 'Article has been inactivated successfully!';
    return {
      message,
    };
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};

export default ChangeArticleStatus;
