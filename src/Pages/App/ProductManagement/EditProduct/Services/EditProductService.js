import axiosInstance from '../../../../../Config/axiosConfig';

const EditProductService = async (data) => {
  const { id, dataToSend } = data;
  try {
    const response = await axiosInstance.post(
      `/admin/products/${id}/update`,
      dataToSend,
      {
        requiresAuth: true,
      }
    );
    return response?.data?.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};

export default EditProductService;
