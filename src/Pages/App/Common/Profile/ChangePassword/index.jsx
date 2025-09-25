import React from 'react';

import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';

import { useForm } from '../../../../../Hooks/useForm';

import ChangeVendorPassword from './Services/ChangeVendorPassword';

import { changePasswordValidationSchema } from './Validations';

import PageTitle from '../../../../../Components/PageTitle';
import CustomCard from '../../../../../Components/CustomCard';
import CustomButton from '../../../../../Components/CustomButton';
import CustomInput from '../../../../../Components/CustomInput';

import { useNavigate } from 'react-router-dom';
import './style.css';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { mutate, isLoading } = useForm({
    onSuccess: (response) => {
      toast.success(response.message);
      navigate('/profile');
      
    },
    onError: (error) => {
      console.error('Password update failed:', error);
    },
  });

  const handleSubmit = async (values) => {
    mutate({
      service: ChangeVendorPassword,
      data: values,
    });
  };

  return (
    <div className="profileScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title="Change Password"
            backButton={true}
            backButtonLink={'/profile'}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            <Formik
              initialValues={{
                current_password: '',
                password: '',
                password_confirmation: '',
              }}
              validationSchema={changePasswordValidationSchema}
              onSubmit={handleSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                isSubmitting,
              }) => (
                <Form>
                  <div className="row mb-4 profileDetails">
                    <div className="col-12 col-lg-10 col-xl-8">
                      <div className="row mt-4">
                        <div className="col-12">
                          <div className="mb-3">
                            <CustomInput
                              label="Current Password"
                              id="current_password"
                              name="current_password"
                              type="password"
                              maxLength={16}
                              placeholder="Enter Current Password"
                              value={values.current_password}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.current_password &&
                                errors.current_password
                              }
                              required
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="mb-3">
                            <CustomInput
                              label="New Password"
                              id="password"
                              name="password"
                              type="password"
                              maxLength={16}
                              placeholder="Enter New Password"
                              value={values.password}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.password && errors.password}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="mb-3">
                            <CustomInput
                              label="Confirm Password"
                              id="password_confirmation"
                              name="password_confirmation"
                              type="password"
                              maxLength={16}
                              placeholder="Enter Confirm Password"
                              value={values.password_confirmation}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.password_confirmation &&
                                errors.password_confirmation
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-12">
                      <div className="d-flex align-items-center gap-3">
                        <CustomButton
                          isLoading={isLoading}
                          text="Change Password"
                          type="submit"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </CustomCard>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
