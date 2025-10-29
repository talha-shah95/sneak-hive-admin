import axiosInstance from '../../../../Config/axiosConfig';

export const VerifyCode = async (data) => {
  try {
    const response = await axiosInstance.post('/verify-code', data, {
      requiresAuth: false,
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};
