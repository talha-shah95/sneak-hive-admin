import * as Yup from 'yup';

export const editBannerValidationSchema = Yup.object().shape({
  heading: Yup.string().required('Introductory heading is required'),
  is_active: Yup.number().required('Status is required'),
  file: Yup.mixed().required(
    'Introductory banner is required'
  ),
});
