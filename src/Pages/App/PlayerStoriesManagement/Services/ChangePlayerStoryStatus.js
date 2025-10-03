import axiosInstance from '../../../../Config/axiosConfig';

const ChangePlayerStoryStatus = async (id) => {
  try {
    const response = await axiosInstance.post(
      `/admin/player-stories/${id}/status`,
      {},
      {
        requiresAuth: true,
      }
    );
    const message =
      response.data.data.is_active == 1
        ? 'Player Story has been activated successfully!'
        : 'Player Story has been inactivated successfully!';
    return {
      message,
    };
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};

export default ChangePlayerStoryStatus;
