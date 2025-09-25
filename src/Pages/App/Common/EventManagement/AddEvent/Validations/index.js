import * as Yup from 'yup';

export const addEventValidationSchema = Yup.object().shape({
  name: Yup.string().required('Event name is required'),
  type: Yup.string().required('Event type is required'),
  description: Yup.string().required('Event description is required'),
  enrollment_price: Yup.string().required('Event enrollment price is required'),
  // Conditional validation for location and map_link based on event type
  location: Yup.string().when('type', {
    is: (type) => type === 'Onsite' || type === 'Hybrid',
    then: (schema) => schema.required('Event location is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  map_link: Yup.string().when('type', {
    is: (type) => type === 'Onsite' || type === 'Hybrid',
    then: (schema) => schema.required('Event map link is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  // Conditional validation for online session link based on event type
  online_session_link: Yup.string().when('type', {
    is: (type) => type === 'Online' || type === 'Hybrid',
    then: (schema) => schema.required('Event online session link is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  event_date: Yup.string().required('Event date is required'),
  start_time: Yup.string().required('Event start time is required'),
  end_time: Yup.string().required('Event end time is required'),
  includes_alcohol: Yup.string().required('Event includes alcohol is required'),
  // Conditional validation for legal age based on alcohol inclusion
  legal_age: Yup.string().when('includes_alcohol', {
    is: 'true',
    then: (schema) => schema.required('Event legal age is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
//   medias: Yup.array().min(1, 'At least one media file is required').required('Event medias is required'),
});
