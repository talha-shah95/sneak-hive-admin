import * as Yup from 'yup';

export const adRequestValidationSchema = Yup.object().shape({
  title: Yup.string().required('Advertisement title is required'),
  email: Yup.string().required('Email Address is required'),
  url: Yup.string().required('URL is required'),
  medias: Yup.array().required('Advertisement images are required'),
});
