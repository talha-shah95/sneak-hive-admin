import axiosInstance from '../../../../../Config/axiosConfig';

const EditBlogService = async (data) => {
  const { id, formDataToSend } = data;
  try {
    const response = await axiosInstance.post(
      `/admin/blogs/${id}/update`,
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

export default EditBlogService;
