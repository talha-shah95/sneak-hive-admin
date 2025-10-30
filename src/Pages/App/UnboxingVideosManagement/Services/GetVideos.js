import axiosInstance from '../../../../Config/axiosConfig';

const GetUnboxingVideos = async (filters, pagination) => {
  const from = filters.from ? filters.from : '';
  const to = filters.to ? filters.to : '';
  const search = filters.search ? filters.search : '';
  const per_page = pagination.perPage ? pagination.perPage : 5;
  const status = filters.status ? filters.status : '';
  const page = filters?.page ? filters?.page : 1;
  try {
    const response = await axiosInstance.get(
      `/admin/videos?search=${search}&from=${from}&to=${to}&status=${status}&records=${per_page}&page=${page}`
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};

export default GetUnboxingVideos;
