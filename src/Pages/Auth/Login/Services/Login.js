import axiosInstance from '../../../../Config/axiosConfig';

export const LoginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post('/admin/login', credentials, {
      requiresAuth: false,
    });
    const token = response?.data?.data?.access_token;
    const user = response?.data?.data?.user;
    const message = response?.data?.message;

    return {
      token,
      user,
      message,
    };
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};
