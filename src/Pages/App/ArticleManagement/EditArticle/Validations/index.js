import * as Yup from 'yup';

export const editArticleValidationSchema = Yup.object().shape({
  title: Yup.string().required('Article title is required'),
  category_id: Yup.number().required('Category is required'),
  published_by: Yup.string().required('Published by is required'),
  details: Yup.string().required('Article details is required'),
  link: Yup.string().required('Article link is required'),
  is_active: Yup.number().required('Status is required'),
  file: Yup.mixed().required('Cover image is required'),
});
