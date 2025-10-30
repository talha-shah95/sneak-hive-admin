import axiosInstance from '../../../../Config/axiosConfig';

const GetActiveBrands = async () => {
  try {
    const response = await axiosInstance.get(`/admin/get-brands`);
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};

export default GetActiveBrands;
