import axiosInstance from '../../../../../../Config/axiosConfig';

const PayNowAd = async ({ adId, planId, data }) => {
  console.log('data', data, adId, planId);
  // const { adId, planId, data: dataToSend } = data;
  try {
    const response = await axiosInstance.get(
      `/vendor/payment-log/ad/${adId}/create/${planId}/payment-link`,
      // dataToSend,
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

export default PayNowAd;
