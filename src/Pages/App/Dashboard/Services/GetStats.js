import axiosInstance from '../../../../Config/axiosConfig';

// GET USER CHART
const getStats = async () => {
  try {
    const response = await axiosInstance.get(`/vendor/dashboard/statistics`);
    return response.data.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};

export default getStats;
