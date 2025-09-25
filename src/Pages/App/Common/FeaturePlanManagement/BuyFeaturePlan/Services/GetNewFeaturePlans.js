import axiosInstance from '../../../../../../Config/axiosConfig';

const GetNewFeaturePlans = async (filters, pagination) => {
  const from = filters.from ? filters.from : '';
  const to = filters.to ? filters.to : '';
  const search = filters.search ? filters.search : '';
  const per_page = pagination.per_page ? pagination.per_page : 5;
  try {
    const response = await axiosInstance.get(
      `/vendor/plan?search=${search}&date_from=${from}&date_to=${to}&per_page=${per_page}`
    );
    return response.data.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};

export default GetNewFeaturePlans;
