import axiosInstance from '../Config/axiosConfig';

const GetBusinessFormData = async () => {
  try {
    const response = await axiosInstance.get(
      '/general/vendor-signup-form-data',
      {
        requiresAuth: false,
      }
    );
    return response?.data?.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};

export default GetBusinessFormData;
