import * as Yup from 'yup';

export const editSubCategoryValidationSchema = Yup.object().shape({
  name: Yup.string().required('Sub Category name is required'),
  show: Yup.string().required('Show sub category in is required'),
  is_active: Yup.number().required('Status is required'),
});
