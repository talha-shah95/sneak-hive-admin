import * as Yup from 'yup';

export const editBlogValidationSchema = Yup.object().shape({
  title: Yup.string().required('Blog title is required'),
  caption: Yup.string().required('Blog caption is required'),
  product_id: Yup.number().required('Product ID is required'),
  is_active: Yup.number().required('Status is required'),
  content_file: Yup.mixed().required('Blog content image is required'),
});
