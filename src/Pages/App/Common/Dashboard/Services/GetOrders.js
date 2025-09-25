import axiosInstance from '../../../../../Config/axiosConfig';

// GET ORDERS
const getOrders = async ({ type }) => {
  try {
    const response = await axiosInstance.get(
      `/vendor/dashboard/get-order-chart-data?type=${type}`
    );
    return response.data.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};

export default getOrders;
