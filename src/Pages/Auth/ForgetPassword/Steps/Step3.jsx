import { Form, Formik } from 'formik';
import React from 'react';
import { forgetPasswordThreeValidationSchema } from '../Validations';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import { Link } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';

const Step3 = ({ action, isLoading }) => {
  return (
    <div>
      <p className="mb-4">Set New Password for your Account.</p>
      <Formik
        initialValues={{ password: '', confirmPassword: '' }}
        validationSchema={forgetPasswordThreeValidationSchema}
        onSubmit={action}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form>
            <CustomInput
              type={'password'}
              label={'New Password'}
              required
              id={'password'}
              name={'password'}
              placeholder={'Enter Your New Password'}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              error={touched.password && errors.password}
              tabIndex={1}
              autoFocus
              eyeColor={'#420080'}
              labelClass={'text-capitalize fw-semibold'}
              wrapperClass={'mb-4'}
              IconToBeUsedLeft={FiLock}
            />
            <CustomInput
              type={'password'}
              label={'Confirm Password'}
              required
              id={'confirmPassword'}
              name={'confirmPassword'}
              placeholder={'Confirm Your New Password'}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.confirmPassword}
              error={touched.confirmPassword && errors.confirmPassword}
              tabIndex={2}
              eyeColor={'#420080'}
              labelClass={'text-capitalize fw-semibold'}
              wrapperClass={'mb-4'}
              IconToBeUsedLeft={FiLock}
            />
            <div className="mt-4 text-center beechMein">
              <CustomButton
                type="submit"
                text="Update"
                variant="secondary"
                tabIndex={3}
                loading={isLoading}
                disabled={isLoading}
              />
            </div>
          </Form>
        )}
      </Formik>
      <p className="text-center mt-4">
        Back to{' '}
        <Link to={'/login'} className="colorPrimary">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Step3;
