import * as Yup from 'yup';

export const addTertiaryCategoryValidationSchema = Yup.object().shape({
  name: Yup.string().required('Tertiary Category name is required'),
  sub_category_id: Yup.string().required('Sub category is required'),
  is_active: Yup.number().required('Status is required'),
});
