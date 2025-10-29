import axiosInstance from '../../../../Config/axiosConfig';

export const SendEmail = async (data) => {
  try {
    const response = await axiosInstance.post('/forget-password', data, {
      requiresAuth: false,
    });
    const message = response?.data?.message;
    return {
      message,
    };
  } catch (error) {
    throw error.response        
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};
