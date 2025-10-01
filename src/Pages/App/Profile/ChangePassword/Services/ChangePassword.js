import axiosInstance from '../../../../../Config/axiosConfig';

const ChangePassword = async (data) => {
  try {
    const response = await axiosInstance.post('/change-password', data, {
      requiresAuth: true,
    });
    const message = response?.data?.data.message;
    return {
      message,
    };
  } catch (error) {
    throw error.response
      ? error.response.data.data.message.failed
      : { message: 'Unknown error occurred' };
  }
};

export default ChangePassword;
