import axiosInstance from '../../../../../../Config/axiosConfig';

const GetAdDetails = async (id) => {
  try {
    const response = await axiosInstance.get(`/vendor/ad/${id}/details`);
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};

export default GetAdDetails;
