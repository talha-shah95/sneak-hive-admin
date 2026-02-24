import * as Yup from 'yup';

export const addProductValidationSchema = Yup.object().shape({
  name: Yup.string().required('Product name is required'),
  description: Yup.string().required('Product description is required'),
  suitable_for: Yup.string().required('Best suitable for is required'),
  color: Yup.string().required('Color is required'),
  release_date: Yup.date().required('Release date is required'),
  category_ids: Yup.array()
    .min(1, 'At least one category is required')
    .required('Product category is required'),
  sub_category_ids: Yup.array()
    .min(1, 'At least one sub category is required')
    .required('Product sub category is required'),
  tertiary_category_ids: Yup.array()
    .min(1, 'At least one tertiary category is required')
    .required('Tertiary category is required'),
  signature_shoe: Yup.string(),
  style: Yup.string().required('Style is required'),
  availibility: Yup.string().required('Product availability is required'),
  is_active: Yup.number().required('Product status is required'),
  brands: Yup.array()
    .of(
      Yup.object().shape({
        brand_id: Yup.string().required('Brand selection is required'),
        price: Yup.number()
          .typeError('Price must be a number')
          .required('Price is required')
          .positive('Price must be greater than 0'),
        affiliate_link: Yup.string()
          .url('Please enter a valid URL')
          .required('Affiliate link is required'),
      })
    )
    .min(1, 'At least one brand entry is required'),
  details: Yup.array()
    .of(
      Yup.object().shape({
        weight: Yup.string().required('Weight selection is required'),
        sizing: Yup.string().required('Sizing selection is required'),
        width: Yup.string().required('Width selection is required'),
      })
    )
    .min(1, 'At least one weight and sizing entry is required'),
  reviews: Yup.array()
    .of(
      Yup.object().shape({
        rating: Yup.string().required('Rating is required'),
        review: Yup.string()
          .required('Overall review is required')
          .min(10, 'Review must be at least 10 characters'),
        rating_status: Yup.string(),
        traction: Yup.string().required('Traction rating is required'),
        traction_detail: Yup.string(),
        cushion: Yup.string().required('Cushion rating is required'),
        cushion_detail: Yup.string(),
        material: Yup.string().required('Material rating is required'),
        material_detail: Yup.string(),
        support: Yup.string().required('Support rating is required'),
        support_detail: Yup.string(),
        fit: Yup.string().required('Fit rating is required'),
        fit_detail: Yup.string(),
        outdoor: Yup.string().required('Outdoor rating is required'),
        outdoor_detail: Yup.string(),
        width: Yup.string().required('Width rating is required'),
        width_detail: Yup.string(),
        size: Yup.string().required('Size rating is required'),
        size_detail: Yup.string(),
      })
    )
    .min(1, 'At least one review entry is required'),
  pros: Yup.array()
    .of(
      Yup.string()
        .min(1, 'Pro cannot be empty')
        .required('Pro is required')
    )
    .min(1, 'At least one pro is required')
    .test('non-empty-pros', 'All pros must have content', (pros) => {
      return pros && pros.some((pro) => pro && pro.trim().length > 0);
    }),
  cons: Yup.array()
    .of(
      Yup.string()
        .min(1, 'Con cannot be empty')
        .required('Con is required')
    )
    .min(1, 'At least one con is required')
    .test('non-empty-cons', 'All cons must have content', (cons) => {
      return cons && cons.some((con) => con && con.trim().length > 0);
    }),
  // images: Yup.mixed().required('Product image is required'),
});
