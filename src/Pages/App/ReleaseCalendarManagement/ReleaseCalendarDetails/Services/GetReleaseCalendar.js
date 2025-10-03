import axiosInstance from '../../../../../Config/axiosConfig';

const GetReleaseCalendar = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/release-calenders/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};

export default GetReleaseCalendar;
