import axiosInstance from '../../../../../../Config/axiosConfig';

const AddPromoCodeService = async (data) => {
  try {
    const response = await axiosInstance.post(
      '/vendor/promo-code/create',
      data,
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

export default AddPromoCodeService;
