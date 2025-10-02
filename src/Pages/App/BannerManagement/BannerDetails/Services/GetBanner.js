import axiosInstance from '../../../../../Config/axiosConfig';

const GetBanner = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/banners/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};

export default GetBanner;
