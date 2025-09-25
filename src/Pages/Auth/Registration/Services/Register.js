import axiosInstance from '../../../../Config/axiosConfig';

const RegisterUser = async (data) => {
  try {
    const response = await axiosInstance.post('/signup', data, {
      requiresAuth: false,
    });
    return {
      token: response.data.token,
      message: response?.data?.message,
    };
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};

export default RegisterUser;