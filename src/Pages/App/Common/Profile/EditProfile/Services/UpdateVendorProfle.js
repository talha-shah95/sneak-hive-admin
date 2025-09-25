import axiosInstance from '../../../../../../Config/axiosConfig';

const UpdateVendorProfile = async (data) => {
  try {
    const response = await axiosInstance.post('/vendor/profile/update', data, {
      requiresAuth: true,
    });

    return response?.data?.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};

export default UpdateVendorProfile;
