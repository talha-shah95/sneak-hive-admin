import axiosInstance from '../../../../../Config/axiosConfig';

const DeleteProductImage = async (data) => {
  const { productId, imageId } = data;
  try {
    const response = await axiosInstance.post(
      `/admin/products/${productId}/images/${imageId}/delete`,
      {},
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

export default DeleteProductImage;
