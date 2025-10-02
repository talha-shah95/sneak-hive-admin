import axiosInstance from '../../../../Config/axiosConfig';

const GetBanners = async (filters, pagination) => {
  const from = filters.from ? filters.from : '';
  const to = filters.to ? filters.to : '';
  const search = filters.search ? filters.search : '';
  const per_page = pagination.per_page ? pagination.per_page : 5;
  console.log('filters', filters, pagination, from, to, search, per_page);
  try {
    const response = await axiosInstance.get(`/admin/banners`);
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};

export default GetBanners;
