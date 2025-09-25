import axiosInstance from '../../../../../../Config/axiosConfig';

const adRequestService = async (data) => {
  try {
    const response = await axiosInstance.post('/vendor/ad/create', data, {
      requiresAuth: true,
    });
    return response?.data?.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};

export default adRequestService;
