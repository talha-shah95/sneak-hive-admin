import axiosInstance from '../Config/axiosConfig';

//Get States by Country ID
const GetStates = async (countryId) => {
  try {
    const response = await axiosInstance.get(
      `/app/general/${countryId}/state-by-country`,
      {
        requiresAuth: false,
      }
    );
    return response?.data?.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};

export default GetStates;
