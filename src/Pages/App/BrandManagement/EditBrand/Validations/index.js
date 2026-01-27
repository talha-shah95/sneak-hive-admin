import * as Yup from 'yup';

export const editBrandValidationSchema = Yup.object().shape({
  name: Yup.string().required('Brand name is required'),
  is_active: Yup.number().required('Status is required'),
  file: Yup.mixed().nullable().optional(
    'Brand image is required'
  ),
});
