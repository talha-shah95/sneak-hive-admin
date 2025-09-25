import axiosInstance from '../../../../../../Config/axiosConfig';

const mockData = {
  name: 'Tech Conference 2025 update',
  type: 'Hybrid',
  description: 'Join us for an exciting online tech conference.',
  enrollment_price: 10,
  location: 'New York City, NY',
  map_link: 'https://maps.google.com/?q=new+york+city',
  online_session_link: 'https://zoom.us/j/123456789',
  event_date: '2025-10-01',
  includes_alcohol: 1,
  legal_age: 21,
  start_time: '18:00:00',
  end_time: '21:00:00',
};

const GetEventDetails = async (id) => {
  try {
    // const response = await axiosInstance.get(`/vendor/event/${id}/details`);
    return mockData;
    // return response.data.data;
  } catch (error) {
    throw error.response
      ? error.response.data.message
      : { message: 'Unknown error occurred' };
  }
};

export default GetEventDetails;
