import * as Yup from 'yup';

export const addProductValidationSchema = Yup.object().shape({
  name: Yup.string().required('Product name is required'),
  description: Yup.string().required('Product description is required'),
  suitable_for: Yup.string().required('Best suitable for is required'),
  category_ids: Yup.array().required('Product category is required'),
  sub_category_ids: Yup.array().required('Product sub category is required'),
  signature_shoe: Yup.string(),
  style: Yup.string().required('Style is required'),
  availibility: Yup.string().required('Product availability is required'),
  is_active: Yup.number().required('Product status is required'),
  brands: Yup.array()
    .of(
      Yup.object().shape({
        brand_id: Yup.string().required('Brand is required'),
        price: Yup.number().required('Price is required'),
        affiliate_link: Yup.string().required('Affiliate link is required'),
      })
    )
    .min(1, 'At least one brand is required'),
  details: Yup.array()
    .of(
      Yup.object().shape({
        weight: Yup.string().required('Weight is required'),
        sizing: Yup.string().required('Sizing is required'),
        width: Yup.string().required('Width is required'),
      })
    )
    .min(1, 'At least one detail is required'),
  reviews: Yup.array()
    .of(
      Yup.object().shape({
        rating: Yup.string().required('Rating is required'),
        review: Yup.string().required('Review is required'),
        rating_status: Yup.string(),
        traction: Yup.string(),
        traction_detail: Yup.string(),
        cushion: Yup.string(),
        cushion_detail: Yup.string(),
        material: Yup.string(),
        material_detail: Yup.string(),
        support: Yup.string(),
        support_detail: Yup.string(),
        fit: Yup.string(),
        fit_detail: Yup.string(),
        outdoor: Yup.string(),
        outdoor_detail: Yup.string(),
        width: Yup.string(),
        width_detail: Yup.string(),
        size: Yup.string(),
        size_detail: Yup.string(),
      })
    )
    .min(1, 'At least one review is required'),
  pros: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one pro is required'),
  cons: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one con is required'),
  // images: Yup.mixed().required('Product image is required'),
});
