import axiosInstance from '../Config/axiosConfig';

const GetProductFormData = async () => {
  try {
    const response = await axiosInstance.get(
      '/general/vendor-add-product-form-data',
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

export default GetProductFormData;
