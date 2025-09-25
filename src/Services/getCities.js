import axiosInstance from '../Config/axiosConfig';

//Get Cities by State ID
const GetCities = async (stateId) => {
  try {
    const response = await axiosInstance.get(
      `/app/general/${stateId}/cities-by-state`,
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

export default GetCities;
