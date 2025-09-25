import axiosInstance from '../../../../../../Config/axiosConfig';

const PayNowFeaturePlan = async ({ id, data }) => {
  try {
    const response = await axiosInstance.post(
      `/vendor/payment-log/create/${id}/payment-link`,
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

export default PayNowFeaturePlan;
