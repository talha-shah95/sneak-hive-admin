import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Form, Formik } from 'formik';

import { loginValidationSchema } from './Validations';

import { useForm } from '../../../Hooks/useForm';
import { LoginUser } from './Services/Login.js';
import useUserStore from '../../../Store/UserStore.js';
import { saveAuthData } from '../../../Utils/Storage.js';

import CustomInput from '../../../Components/CustomInput';
import CustomButton from '../../../Components/CustomButton';
import CustomCheckbox from '../../../Components/CustomCheckBox';
import { showToast } from '../../../Components/CustomToast';

import { FaRegEnvelope } from 'react-icons/fa';
import { FiLock } from 'react-icons/fi';

import './style.css';

const Login = () => {
  const { setUser, setRole, setToken } = useUserStore();
  const [isRememberMe, setIsRememberMe] = useState(false);

  const { mutate, isLoading } = useForm({
    successMessage: 'Login successful!',
    redirectTo: '/dashboard',

    onSuccess: (response) => {
      // Update global state
      setUser(response.user);
      setRole(response.user.role);
      setToken(response.token);

      // Save to appropriate storage based on remember me
      saveAuthData(response, isRememberMe);
    },
    onError: (error) => {
      showToast(error?.data?.message?.failed, 'error');
      console.error('Login failed:', error);
    },
  });

  const handleSubmit = (values) => {
    const dataToSend = {
      ...values,
      type: 'vendor',
    };
    mutate({
      service: LoginUser,
      data: dataToSend,
    });
  };

  const handleRememberMeChange = () => {
    setIsRememberMe(!isRememberMe);
  };

  return (
    <div className="formCardWrapper mx-auto">
      <div className="formCard">
        <div className="formCardHeader my-3">
          <h1 className="text-uppercase">Admin Login</h1>
        </div>
        {/* Form */}
        <div className="mt-4">
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
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
                <CustomInput
                  type={'password'}
                  label={'Password'}
                  required
                  id={'password'}
                  name={'password'}
                  placeholder={'Enter Password'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  error={touched.password && errors.password}
                  tabIndex={1}
                  autoFocus
                  eyeColor={'#420080'}
                  labelClass={'text-capitalize fw-semibold'}
                  IconToBeUsedLeft={FiLock}
                />
                <div className="d-flex flex-wrap justify-content-between mt-2">
                  <CustomCheckbox
                    id="myCheckbox"
                    label="Remember Me"
                    checked={isRememberMe}
                    size="16px"
                    className="text14"
                    onChange={handleRememberMeChange}
                  />
                  <Link
                    to={'/forget-password'}
                    className="colorPrimary text14"
                    tabIndex={5}
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="mt-4 text-center beechMein">
                  <CustomButton
                    type="submit"
                    text="Login"
                    variant="secondary"
                    tabIndex={3}
                    loading={isLoading}
                    disabled={isLoading}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      {/* <GlobalSkeleton /> */}
    </div>
  );
};

export default Login;
