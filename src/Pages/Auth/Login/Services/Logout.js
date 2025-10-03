import axiosInstance from '../../../../Config/axiosConfig';

export const LogoutUser = async () => {
  try {
    await axiosInstance.post('/admin/logout', {}, {
      requiresAuth: true,
    });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');

    return { message: 'Logout successful' };
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Unknown error occurred' };
  }
};
