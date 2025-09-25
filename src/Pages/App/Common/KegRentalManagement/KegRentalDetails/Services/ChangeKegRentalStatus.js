import axiosInstance from '../../../../../../Config/axiosConfig';

const ChangeKegRentalStatus = async ({ id, payload }) => {
  try {
    const response = await axiosInstance.post(
      `/vendor/keg-rental/${id}/update-status`,
      payload,
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

export default ChangeKegRentalStatus;
