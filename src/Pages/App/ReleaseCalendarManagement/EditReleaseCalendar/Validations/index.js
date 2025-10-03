import * as Yup from 'yup';

export const editReleaseCalendarValidationSchema = Yup.object().shape({
  brand_id: Yup.number().required('Brand is required'),
  calender_title: Yup.string().required('Calendar title is required'),
  shoe_name: Yup.string().required('Shoe name is required'),
  shoe_affiliate_link: Yup.string().required('Shoe affiliate link is required'),
  publish_date: Yup.string().required('Publish date is required'),
  release_date: Yup.string().required('Release date is required'),
  is_active: Yup.number().required('Status is required'),
  file: Yup.mixed().required('Shoe image is required'),
});
