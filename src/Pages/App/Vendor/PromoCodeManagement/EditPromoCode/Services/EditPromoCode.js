import axiosInstance from '../../../../../../Config/axiosConfig';

const EditPromoCodeService = async ({ id, data }) => {
  try {
    const response = await axiosInstance.post(
      `/vendor/promo-code/${id}/update`,
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

export default EditPromoCodeService;
