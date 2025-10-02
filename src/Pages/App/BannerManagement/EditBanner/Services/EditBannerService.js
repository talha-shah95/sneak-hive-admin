import axiosInstance from '../../../../../Config/axiosConfig';

const EditBannerService = async (data) => {
  const { id, formDataToSend } = data;
  try {
    const response = await axiosInstance.post(
      `/admin/banners/${id}/update`,
      formDataToSend,
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

export default EditBannerService;
