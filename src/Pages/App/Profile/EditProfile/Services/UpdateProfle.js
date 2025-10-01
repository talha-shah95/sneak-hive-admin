import axiosInstance from '../../../../../Config/axiosConfig';

const UpdateProfile = async (data) => {
  try {
    const response = await axiosInstance.post('/edit-profile', data, {
      requiresAuth: true,
    });

    return response?.data?.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};

export default UpdateProfile;
