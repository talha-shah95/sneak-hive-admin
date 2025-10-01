import React, { useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Formik, Form } from 'formik';

import { useForm } from '../../../../Hooks/useForm';

import useUserStore from '../../../../Store/UserStore';

import UpdateProfile from './Services/UpdateProfle';
import getProfile from '../Services/GetProfile';

import { editProfileValidationSchema } from './Validations';

import { images } from '../../../../assets/images';

import LineSkeleton from '../../../../Components/SkeletonLoaders/LineSkeleton';
import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomButton from '../../../../Components/CustomButton';
import CustomInput from '../../../../Components/CustomInput';

import { RiImageAddLine } from 'react-icons/ri';

import './style.css';

const EditProfile = () => {
  const { setUser } = useUserStore();
  const [profileImage, setProfileImage] = useState(null);

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useForm({
    successMessage: 'Profile updated successfully!',
    redirectTo: '/profile',

    onSuccess: (response) => {
      // Invalidate and refetch userProfile query
      queryClient.invalidateQueries(['userProfile']);
      setUser(response);
    },
    onError: (error) => {
      console.error('Profile update failed:', error);
    },
  });

  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => getProfile(),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleSubmit = (values) => {
    console.log('values', values);
    const dataToSend = {
      first_name: values.first_name,
      last_name: values.last_name,
      image: profileImage ? profileImage : values.image,
    };

    // if (!profileImage) {
    //   delete dataToSend.image;
    // }

    const formDataToSend = new FormData();
    formDataToSend.append('first_name', dataToSend.first_name);
    formDataToSend.append('last_name', dataToSend.last_name);
    if (profileImage) {
      formDataToSend.append('image', dataToSend.image);
    }
    // Profile image (if present)

    console.log('dataToSend', dataToSend);
    console.log('profileImage', profileImage);
    mutate({
      service: UpdateProfile,
      data: formDataToSend,
    });
  };

  console.log(profileData);

  return (
    <div className="profileScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title="Edit Profile"
            backButton={true}
            backButtonLink={'/profile'}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            {isProfileError ? (
              <p className="text-center fs-4 my-4 text-danger">
                {profileError || 'Something went wrong'}
              </p>
            ) : (
              <>
                {isProfileLoading ? (
                  <LineSkeleton lines={10} />
                ) : (
                  <>
                    <Formik
                      initialValues={{
                        image: profileData?.avatar || '',
                        first_name: profileData?.first_name || '',
                        last_name: profileData?.last_name || '',
                      }}
                      validationSchema={editProfileValidationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                      }) => (
                        <Form>
                          <div className="row mb-4 profileDetails">
                            <div className="col-12">
                              <h3 className="secondaryTitle">
                                Profile Details
                              </h3>
                            </div>
                            <div className="col-12">
                              <div className="roundImageWrapper roundImage mt-3">
                                <img
                                  src={
                                    profileImage
                                      ? URL.createObjectURL(profileImage)
                                      : values.image || images?.userPlaceholder
                                  }
                                  onError={(e) => {
                                    e.target.src = images?.userPlaceholder;
                                  }}
                                  alt="Profile"
                                />
                                <input
                                  id="image"
                                  type="file"
                                  accept="image/*"
                                  className="d-none"
                                  onChange={handleProfileImageChange}
                                />
                                <label
                                  htmlFor="image"
                                  type="button"
                                  className="changeImageButton"
                                >
                                  <RiImageAddLine size={20} />
                                </label>
                              </div>
                            </div>
                            <div className="col-12 col-xl-10">
                              <div className="row mt-4">
                                <div className="col-12">
                                  <div className="mb-3">
                                    <CustomInput
                                      label="First Name"
                                      id="first_name"
                                      name="first_name"
                                      type="text"
                                      value={values.first_name}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={
                                        touched.first_name && errors.first_name
                                      }
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="mb-3">
                                    <CustomInput
                                      label="Last Name"
                                      id="last_name"
                                      name="last_name"
                                      type="text"
                                      value={values.last_name}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={
                                        touched.last_name && errors.last_name
                                      }
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="mb-3">
                                    <p className="textLabel">Email:</p>
                                    <p className="textValue mt-2">
                                      {profileData?.email || 'N/A'}
                                    </p>
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
                                  text="Update"
                                  type="submit"
                                  disabled={isLoading}
                                />
                              </div>
                            </div>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </>
                )}
              </>
            )}
          </CustomCard>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
