import * as Yup from 'yup';

export const editProfileValidationSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  phone: Yup.string().required('Phone number is required'),
  business_name: Yup.string().required('Business name is required'),
  category_id: Yup.string().required('Business category is required'),
  type_id: Yup.string().required('Business type is required'),
  country_id: Yup.string().required('Country is required'),
  state_id: Yup.string().required('State is required'),
  ein: Yup.string().required('EIN is required'),
  vat_id: Yup.string().required('VAT ID is required'),
});
