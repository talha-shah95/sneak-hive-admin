import axiosInstance from '../../../../../../Config/axiosConfig';

const ChangeVendorPassword = async (data) => {
  try {
    const response = await axiosInstance.post('/vendor/change/password', data, {
      requiresAuth: true,
    });
    const message = response?.data?.message;

    return {
      message,
    };
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};

export default ChangeVendorPassword;
