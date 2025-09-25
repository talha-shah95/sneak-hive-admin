import React from 'react';
import { Link } from 'react-router-dom';

import { Formik, Form, FastField } from 'formik';

import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { registrationValidationSchema } from '../Validations';

import CustomInput from '../../../../Components/CustomInput';
import CustomImageUploader from '../../../../Components/CustomImageUploader';
import CustomButton from '../../../../Components/CustomButton';

const Signup = ({ handleSubmit, isLoading }) => {
  return (
    <>
      <h2 className="text-center mb-2">Registration</h2>
      <div className="mt-4">
        <Formik
          initialValues={{
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            password: '',
            password_confirmation: '',
            profile_image: null,
          }}
          validationSchema={registrationValidationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
            setFieldTouched,
          }) => (
            <Form>
              <CustomInput
                type={'text'}
                label={'First Name'}
                required
                id={'first_name'}
                name={'first_name'}
                placeholder={'Enter Your First Name'}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.first_name}
                error={touched.first_name && errors.first_name}
                tabIndex={1}
                autoFocus
                labelClass={'text-capitalize fw-semibold'}
                wrapperClass={'mb-4'}
              />
              <CustomInput
                type={'text'}
                label={'Last Name'}
                required
                id={'last_name'}
                name={'last_name'}
                placeholder={'Enter Your Last Name'}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.last_name}
                error={touched.last_name && errors.last_name}
                tabIndex={1}
                eyeColor={'#420080'}
                labelClass={'text-capitalize fw-semibold'}
                wrapperClass={'mb-4'}
              />
              <CustomInput
                type={'email'}
                label={'Email Address'}
                required
                id={'email'}
                name={'email'}
                placeholder={'Enter Your Email Address'}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                error={touched.email && errors.email}
                tabIndex={1}
                labelClass={'text-capitalize fw-semibold'}
                wrapperClass={'mb-4'}
              />
              <div className="inputWrapper">
                <label className="mainLabel bold">
                  Phone Number<span className="text-danger">*</span>
                </label>
                <PhoneInput
                  placeholder="Enter phone number"
                  className="mainInput"
                  defaultCountry="US"
                  international
                  withCountryCallingCode
                  focusInputOnCountrySelection={false}
                  onBlur={() => setFieldTouched('phone', true)}
                  onChange={(value) => {
                    setFieldValue('phone', value);
                  }}
                  value={values.phone}
                  name="phone"
                  id="phone"
                />

                {errors.phone && (
                  <div className="input-error-message text-danger">
                    {errors.phone}
                  </div>
                )}
              </div>

              <CustomInput
                type={'password'}
                label={'Password'}
                required
                id={'password'}
                name={'password'}
                placeholder={'Enter Your Password'}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                error={touched.password && errors.password}
                tabIndex={1}
                eyeColor={'#420080'}
                labelClass={'text-capitalize fw-semibold'}
                wrapperClass={'mb-4'}
              />
              <CustomInput
                type={'password'}
                label={'Confirm Password'}
                required
                id={'password_confirmation'}
                name={'password_confirmation'}
                placeholder={'Confirm Your Password'}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password_confirmation}
                error={
                  touched.password_confirmation && errors.password_confirmation
                }
                tabIndex={1}
                labelClass={'text-capitalize fw-semibold'}
                wrapperClass={'mb-4'}
              />
              <CustomImageUploader
                label="Profile Image"
                required
                id="profile_image"
                name="profile_image"
                onChange={(e) => {
                  handleChange({
                    target: {
                      name: 'profile_image',
                      value: e.target.files[0],
                    },
                  });
                }}
                onBlur={handleBlur}
                value={values.profile_image}
              />
              <div className="mt-4 text-center">
                <CustomButton
                  type="submit"
                  text="Register"
                  loading={isLoading}
                  disabled={isLoading}
                />
              </div>
            </Form>
          )}
        </Formik>
        <div className="mt-4 text-center colorGrayDark text14">
          Already have an Account?{' '}
          <Link to={'/login'} className="colorPrimary">
            Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default Signup;
