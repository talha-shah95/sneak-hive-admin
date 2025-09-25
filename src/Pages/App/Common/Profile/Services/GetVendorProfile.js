import axiosInstance from '../../../../../Config/axiosConfig';

// GET USER CHART
const getVendorProfile = async () => {
  try {
    const response = await axiosInstance.get(`/vendor/profile`);
    return response.data.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};

export default getVendorProfile;
