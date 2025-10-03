import axiosInstance from '../../../../Config/axiosConfig';

const GetArticles = async (filters, pagination) => {
  const from = filters.from ? filters.from : '';
  const to = filters.to ? filters.to : '';
  const search = filters.search ? filters.search : '';
  const per_page = pagination.per_page ? pagination.per_page : 5;
  const status = filters.status ? filters.status : '';
  const page = pagination.currentPage ? pagination.currentPage : 1;
  try {
    const response = await axiosInstance.get(
      `/admin/articles?search=${search}&from=${from}&to=${to}&status=${status}&records=${per_page}&page=${page}`
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};

export default GetArticles;
