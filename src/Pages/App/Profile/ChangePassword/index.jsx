import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';

import { useForm } from '../../../../Hooks/useForm';

import ChangePassword from './Services/ChangePassword';

import { changePasswordValidationSchema } from './Validations';

import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomButton from '../../../../Components/CustomButton';
import CustomInput from '../../../../Components/CustomInput';

import { FiLock } from 'react-icons/fi';
import './style.css';

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { mutate, isLoading } = useForm({
    onSuccess: (response) => {
      toast.success(response.message);
      navigate('/profile');
    },
    onError: (error) => {
      toast.error(error.message);
      console.error('Password update failed:', error);
    },
  });

  const handleSubmit = async (values) => {
    mutate({
      service: ChangePassword,
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
                old_password: '',
                new_password: '',
                confirm_password: '',
              }}
              validationSchema={changePasswordValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur }) => (
                <Form>
                  <div className="row mb-4 profileDetails">
                    <div className="col-12 col-lg-10 col-xl-8">
                      <div className="row mt-4">
                        <div className="col-12">
                          <div className="mb-3">
                            <CustomInput
                              label="Current Password"
                              id="old_password"
                              name="old_password"
                              type="password"
                              maxLength={16}
                              placeholder="Enter Current Password"
                              value={values.old_password}
                              IconToBeUsedLeft={FiLock}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.old_password && errors.old_password
                              }
                              required
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="mb-3">
                            <CustomInput
                              label="New Password"
                              id="new_password"
                              name="new_password"
                              type="password"
                              maxLength={16}
                              placeholder="Enter New Password"
                              value={values.new_password}
                              IconToBeUsedLeft={FiLock}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.new_password && errors.new_password
                              }
                              required
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="mb-3">
                            <CustomInput
                              label="Confirm Password"
                              id="confirm_password"
                              name="confirm_password"
                              type="password"
                              maxLength={16}
                              placeholder="Enter Confirm Password"
                              value={values.confirm_password}
                              IconToBeUsedLeft={FiLock}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.confirm_password &&
                                errors.confirm_password
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
                          disabled={isLoading}
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

export default ChangePasswordPage;
