import axiosInstance from '../../../../Config/axiosConfig';

const ChangeReleaseCalendarStatus = async (id) => {
  try {
    const response = await axiosInstance.post(
      `/admin/release-calenders/${id}/status`,
      {},
      {
        requiresAuth: true,
      }
    );
    const message =
      response.data.data.is_active == 1
        ? 'Release Calendar has been activated successfully!'
        : 'Release Calendar has been inactivated successfully!';
    return {
      message,
    };
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};

export default ChangeReleaseCalendarStatus;
