import axiosInstance from '../../../../../Config/axiosConfig';

const GetBlog = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/blogs/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};

export default GetBlog;
