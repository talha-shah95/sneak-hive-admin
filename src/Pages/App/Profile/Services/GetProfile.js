import axiosInstance from '../../../../Config/axiosConfig';

// GET USER CHART
const GetProfile = async () => {
  try {
    const response = await axiosInstance.get(`/get-profile`);
    return response.data.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};

export default GetProfile;
