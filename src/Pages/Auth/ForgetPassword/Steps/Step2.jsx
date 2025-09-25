import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { forgetPasswordTwoValidationSchema } from '../Validations';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import { LuBadgeCheck } from 'react-icons/lu';

const Step2 = ({ action, isLoading, onResend }) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleResend = () => {
    if (canResend) {
      onResend();
      setTimeLeft(60);
      setCanResend(false);
    }
  };
  return (
    <div>
      <p className="mb-4">
        An email has been sent to you with a verification code.
      </p>
      <Formik
        initialValues={{ code: '' }}
        validationSchema={forgetPasswordTwoValidationSchema}
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
              type={'text'}
              label={'Verification Code'}
              required
              id={'code'}
              name={'code'}
              placeholder={'Enter Your Verification Code'}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.code}
              error={touched.code && errors.code}
              tabIndex={1}
              autoFocus
              labelClass={'text-capitalize fw-semibold'}
              wrapperClass={'mb-4'}
              IconToBeUsedLeft={LuBadgeCheck}
            />
            <div className="d-flex flex-wrap justify-content-between mt-2">
              <span className="text14">
                {timeLeft > 0 ? `Resend in ${timeLeft}s` : ''}
              </span>
              <button
                type="button"
                onClick={handleResend}
                className={`colorPrimary fw-semibold text14 border-0 bg-transparent text-decoration-underline text-capitalize text-end ${
                  !canResend ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!canResend}
                tabIndex={5}
              >
                Resend Code
              </button>
            </div>
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

export default Step2;
