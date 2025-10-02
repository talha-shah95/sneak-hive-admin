import * as Yup from 'yup';

export const addBannerValidationSchema = Yup.object().shape({
  heading: Yup.string().required('Banner heading is required'),
  is_active: Yup.number().required('Status is required'),
  file: Yup.mixed().required('Banner image is required'),
});
