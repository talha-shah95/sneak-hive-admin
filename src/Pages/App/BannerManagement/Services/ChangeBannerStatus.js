import axiosInstance from '../../../../Config/axiosConfig';

const ChangeBannerStatus = async (id) => {
  try {
    const response = await axiosInstance.post(
      `/admin/banners/${id}/status`,
      {},
      {
        requiresAuth: true,
      }
    );
    const message = response?.data?.message;
    return {
      message,
    };
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};

export default ChangeBannerStatus;
