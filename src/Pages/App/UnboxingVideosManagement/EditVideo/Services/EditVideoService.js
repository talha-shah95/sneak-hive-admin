import axiosInstance from '../../../../../Config/axiosConfig';

const EditVideoService = async (data) => {
  const { id, dataToSend } = data;
  try {
    const response = await axiosInstance.post(
      `/admin/videos/${id}/update`,
      dataToSend
    );
    return response?.data?.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};

export default EditVideoService;
