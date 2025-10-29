import axiosInstance from '../../../../Config/axiosConfig';

const ChangeUserStatus = async (id) => {
  try {
    const response = await axiosInstance.post(
      `/admin/users/${id}/status`,
      {},
      {
        requiresAuth: true,
      }
    );
    const message =
      response.data.data.is_active == 1
        ? 'User has been Activated successfully!'
        : 'User has been Inactivated successfully!';
    return {
      message,
    };
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};

export default ChangeUserStatus;
