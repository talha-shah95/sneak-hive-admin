import axiosInstance from '../../../../Config/axiosConfig';

export const ResetPassword = async (data) => {
  try {
    const response = await axiosInstance.post('/set-password', data, {
      requiresAuth: false,
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};
