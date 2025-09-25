import axiosInstance from '../../../../Config/axiosConfig';

const RegisterBusinessProfile = async ({ data, token }) => {
  try {
    const response = await axiosInstance.post(
      '/vendor/business-profile/register',
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};

export default RegisterBusinessProfile;
