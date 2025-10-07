import * as Yup from 'yup';

export const editProductValidationSchema = Yup.object().shape({
  name: Yup.string().required('Product name is required'),
  description: Yup.string().required('Product description is required'),
  price: Yup.number().required('Product price is required'),
  category_ids: Yup.array().required('Product category is required'),
  sub_category_ids: Yup.array().required('Product sub category is required'),
  brand_id: Yup.string().required('Product brand is required'),
  affiliate_link: Yup.string().required('Product affiliate link is required'),
  availibility: Yup.string().required('Product availability is required'),
  is_active: Yup.number().required('Product status is required'),
  // image: Yup.mixed().required('Product image is required'),
});
