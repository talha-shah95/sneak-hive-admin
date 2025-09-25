import axiosInstance from '../../../../../../Config/axiosConfig';

const GetDocumentDetails = async () => {
  try {
    const response = await axiosInstance.get(`/vendor/license/1/details`);
    return response.data.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};

export default GetDocumentDetails;
