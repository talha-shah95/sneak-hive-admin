import * as Yup from 'yup';

export const addCategoryValidationSchema = Yup.object().shape({
  name: Yup.string().required('Category name is required'),
  show: Yup.string().required('Show category in is required'),
  is_active: Yup.number().required('Status is required'),
});
