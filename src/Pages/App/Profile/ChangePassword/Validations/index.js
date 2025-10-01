import * as Yup from 'yup';

export const changePasswordValidationSchema = Yup.object().shape({
  old_password: Yup.string().required('Current password is required'),
  new_password: Yup.string()
    .required('New password is required')
    .min(8, 'New password must be at least 8 characters long')
    .max(16, 'New password must be less than 16 characters long')
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    //   'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    // )
    .notOneOf(
      [Yup.ref('old_password')],
      'New password must be different from current password'
    ),
  confirm_password: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('new_password'), null], 'Passwords must match'),
});
