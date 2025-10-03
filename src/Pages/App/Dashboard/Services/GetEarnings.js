import axiosInstance from '../../../../Config/axiosConfig';

// GET EARNINGS
const getEarnings = async ({ type }) => {
  try {
    const response = await axiosInstance.get(
      `/vendor/dashboard/get-earning-chart-data?type=${type}`
    );

    return response.data.data;
  } catch (error) {
    console.log('error', error);
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};

export default getEarnings;
