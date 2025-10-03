import * as Yup from 'yup';

export const addVideoValidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  brand_id: Yup.number().required('Brand is required'),
  description: Yup.string().required('Description is required'),
  affiliate_link: Yup.string().required('Affiliate link is required'),
  is_active: Yup.number().required('Status is required'),
  thumbnail_file: Yup.mixed().required('Thumbnail image is required'),
  video_file: Yup.mixed().required('Video file is required'),
});
