import { Form, Formik } from 'formik';
import React from 'react';
import { forgetPasswordOneValidationSchema } from '../Validations';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import { Link } from 'react-router-dom';
import { FaRegEnvelope } from 'react-icons/fa';

const Step1 = ({ action, isLoading }) => {
  return (
    <div>
      <p className="mb-4">
        Enter your email address to receive a verification code
      </p>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={forgetPasswordOneValidationSchema}
        onSubmit={action}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          // setFieldValue,
        }) => (
          <Form>
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
              autoFocus
              labelClass={'text-capitalize fw-semibold'}
              wrapperClass={'mb-4'}
              IconToBeUsedLeft={FaRegEnvelope}
            />

            <div className="mt-4 text-center beechMein">
              <CustomButton
                type="submit"
                text="Continue"
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

export default Step1;
