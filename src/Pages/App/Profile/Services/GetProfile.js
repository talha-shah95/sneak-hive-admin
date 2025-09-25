// import axiosInstance from '../../../../Config/axiosConfig';

// GET USER CHART
const GetProfile = async () => {
  // try {
  //   const response = await axiosInstance.get(`/vendor/profile`);
  //   return response.data.data;
  // } catch (error) {
  //   throw error.response
  //     ? error.response.data.message
  //     : { message: 'Unknown error occurred' };
  // }
  return {
    profile_image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkAJEkJQ1WumU0hXNpXdgBt9NUKc0QDVIiaw&s',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
  };
};

export default GetProfile;
