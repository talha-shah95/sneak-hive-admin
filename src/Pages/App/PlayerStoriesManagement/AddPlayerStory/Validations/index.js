import * as Yup from 'yup';

export const addPlayerStoryValidationSchema = Yup.object().shape({
  story_title: Yup.string().required('Story title is required'),
  category_id: Yup.number().required('Category is required'),
  player_name: Yup.string().required('Player name is required'),
  published_by: Yup.string().required('Published by is required'),
  story_details: Yup.string().required('Story details is required'),
  story_link: Yup.string().required('Story link is required'),
  is_active: Yup.number().required('Status is required'),
  file: Yup.mixed().required('Cover image is required'),
});
