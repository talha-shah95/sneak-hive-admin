import * as Yup from 'yup';

export const editPromoCodeValidationSchema = Yup.object().shape({
  promo_code: Yup.string()
    .required('Promo code is required')
    .min(6, 'Promo code must be at least 6 characters')
    .max(8, 'Promo code must be less than 8 characters')
    .matches(
      /^[a-zA-Z0-9]+$/,
      'Promo code must contain only letters and numbers'
    ),
  minimum_spend: Yup.string().required('Minimum spend is required'),
  discount_in_percentage: Yup.string().required(
    'Discount in percentage is required'
  ),
  status: Yup.string().required('Status is required'),
});
