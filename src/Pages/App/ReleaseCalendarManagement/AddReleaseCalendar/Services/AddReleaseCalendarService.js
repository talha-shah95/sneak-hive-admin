import axiosInstance from '../../../../../Config/axiosConfig';

const AddReleaseCalendarService = async (data) => {
  try {
    const response = await axiosInstance.post(
      '/admin/release-calenders',
      data,
      {
        requiresAuth: true,
      }
    );
    return response?.data?.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};

export default AddReleaseCalendarService;
