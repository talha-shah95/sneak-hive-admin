import axiosInstance from '../../../../../../Config/axiosConfig';

const GetPromoCodeDetails = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/vendor/promo-code/${id}/details`
    );
    return response.data.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};

export default GetPromoCodeDetails;
