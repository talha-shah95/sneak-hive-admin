import * as Yup from 'yup';

export const addProductValidationSchema = Yup.object().shape({
  title: Yup.string().required('Product title is required'),
  description: Yup.string().required('Product description is required'),
  quantity: Yup.string().required('Product quantity is required'),
  accessories: Yup.string().required('Accessories is required'),
  price: Yup.string().required('Price is required'),
});
