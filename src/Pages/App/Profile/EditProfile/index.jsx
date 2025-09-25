import React, { useState, useEffect } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Formik, Form } from 'formik';

import { useForm } from '../../../../../Hooks/useForm';

import useUserStore from '../../../../../Store/UserStore';

import UpdateVendorProfile from './Services/UpdateVendorProfle';

import { editProfileValidationSchema } from './Validations';

import GetStates from '../../../../../Services/getStates';
import getVendorProfile from '../Services/GetVendorProfile';
import GetBusinessFormData from '../../../../../Services/getBusinessFormData';

import { images } from '../../../../../assets/images';

import LineSkeleton from '../../../../../Components/SkeletonLoaders/LineSkeleton';
import PageTitle from '../../../../../Components/PageTitle';
import CustomCard from '../../../../../Components/CustomCard';
import CustomButton from '../../../../../Components/CustomButton';
import CustomInput from '../../../../../Components/CustomInput';
import CustomSelect from '../../../../../Components/CustomSelect';
import CustomRadio from '../../../../../Components/CustomRadio';

import { RiImageAddLine } from 'react-icons/ri';

import './style.css';

const EditProfile = () => {
  const { setUser } = useUserStore();
  const [profileImage, setProfileImage] = useState(null);
  const [businessImage, setBusinessImage] = useState(null);
  const [countryId, setCountryId] = useState(null);

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
    data: vendorProfileData,
    isLoading: isVendorProfileLoading,
    isError: isVendorProfileError,
    error: vendorProfileError,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => getVendorProfile(),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  const {
    data: businessFormData,
    isLoading: isBusinessFormDataLoading,
    isError: isBusinessFormDataError,
  } = useQuery({
    queryKey: ['businessFormData'],
    queryFn: () => GetBusinessFormData(),
  });

  const {
    data: statesData,
    isLoading: isStatesDataLoading,
    isError: isStatesDataError,
    refetch: refetchStates,
  } = useQuery({
    queryKey: ['statesData', countryId],
    queryFn: () => GetStates(countryId),
    enabled: false,
  });

  useEffect(() => {
    if (countryId && !statesData && !isStatesDataLoading) {
      refetchStates();
    }
  }, [countryId, refetchStates]);

  useEffect(() => {
    if (vendorProfileData?.business_profile?.country_id && !statesData) {
      setCountryId(vendorProfileData?.business_profile?.country_id);
    }
  }, [vendorProfileData?.business_profile?.country_id, statesData]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleBusinessImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBusinessImage(file);
    }
  };

  const handleSubmit = (values) => {
    const dataToSend = {
      first_name: values.first_name,
      last_name: values.last_name,
      phone: values.phone,
      profile_image: profileImage || values.profile_image,
      business_profile: {
        name: values.business_name,
        category_id: values.category_id,
        type_id: values.type_id,
        country_id: values.country_id,
        state_id: values.state_id,
        ein: values.ein,
        vat_id: values.vat_id,
        referral_code: values.referral_code,
        business_image: businessImage || values.business_image,
      },
    };

    if (!profileImage) {
      delete dataToSend.profile_image;
    }

    if (!businessImage) {
      delete dataToSend.business_profile.business_image;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('first_name', dataToSend.first_name);
    formDataToSend.append('last_name', dataToSend.last_name);
    formDataToSend.append('phone', dataToSend.phone);
    // Profile image (if present)
    if (dataToSend.profile_image) {
      if (dataToSend.profile_image instanceof File) {
        formDataToSend.append('profile_image', dataToSend.profile_image);
      } else {
        formDataToSend.append('profile_image', dataToSend.profile_image);
      }
    }
    const bp = dataToSend.business_profile;
    if (bp) {
      formDataToSend.append('business_profile[name]', bp.name);
      formDataToSend.append('business_profile[category_id]', bp.category_id);
      formDataToSend.append('business_profile[type_id]', bp.type_id);
      formDataToSend.append('business_profile[country_id]', bp.country_id);
      formDataToSend.append('business_profile[state_id]', bp.state_id);
      formDataToSend.append('business_profile[ein]', bp.ein);
      formDataToSend.append('business_profile[vat_id]', bp.vat_id);
      formDataToSend.append(
        'business_profile[referral_code]',
        bp.referral_code
      );

      if (bp.business_image) {
        if (bp.business_image instanceof File) {
          formDataToSend.append(
            'business_profile[profile_image]',
            bp.business_image
          );
        } else {
          formDataToSend.append(
            'business_profile[profile_image]',
            bp.business_image
          );
        }
      }
    }

    mutate({
      service: UpdateVendorProfile,
      data: formDataToSend,
    });
  };

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
            {isVendorProfileError ? (
              <p className="text-center fs-4 my-4 text-danger">
                {vendorProfileError || 'Something went wrong'}
              </p>
            ) : (
              <>
                {isVendorProfileLoading ? (
                  <LineSkeleton lines={10} />
                ) : (
                  <>
                    <Formik
                      initialValues={{
                        profile_image: vendorProfileData?.profile_image || '',
                        first_name: vendorProfileData?.first_name || '',
                        last_name: vendorProfileData?.last_name || '',
                        phone: vendorProfileData?.phone || '',
                        business_name:
                          vendorProfileData?.business_profile?.name || '',
                        category_id:
                          vendorProfileData?.business_profile?.category_id ||
                          '',
                        type_id:
                          vendorProfileData?.business_profile?.type_id || '',
                        country_id:
                          vendorProfileData?.business_profile?.country_id || '',
                        state_id:
                          vendorProfileData?.business_profile?.state_id || '',
                        ein: vendorProfileData?.business_profile?.ein || '',
                        vat_id:
                          vendorProfileData?.business_profile?.vat_id || '',
                        business_image:
                          vendorProfileData?.business_profile?.profile_image ||
                          '',
                        referral_code:
                          vendorProfileData?.business_profile?.referral_code ||
                          '1',
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
                        isSubmitting,
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
                                      : values.profile_image ||
                                        images?.userPlaceholder
                                  }
                                  onError={(e) => {
                                    e.target.src = images?.userPlaceholder;
                                  }}
                                  alt="Profile"
                                />
                                <input
                                  id="profileImage"
                                  type="file"
                                  accept="image/*"
                                  className="d-none"
                                  onChange={handleProfileImageChange}
                                />
                                <label
                                  htmlFor="profileImage"
                                  type="button"
                                  className="changeImageButton"
                                >
                                  <RiImageAddLine size={20} />
                                </label>
                              </div>
                            </div>
                            <div className="col-12 col-xl-10">
                              <div className="row mt-4">
                                <div className="col-6">
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
                                <div className="col-6">
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
                                <div className="col-6 col-lg-4">
                                  <div className="mb-3">
                                    <CustomInput
                                      label="Phone"
                                      id="phone"
                                      name="phone"
                                      type="text"
                                      value={values.phone}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={touched.phone && errors.phone}
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="col-6 col-lg-4">
                                  <div className="mb-3">
                                    <p className="textLabel">Email:</p>
                                    <p className="textValue mt-2">
                                      {vendorProfileData?.email || 'N/A'}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-6 col-lg-4">
                                  <div className="mb-3">
                                    <p className="textLabel">
                                      Commission Rate:
                                    </p>
                                    <p className="textValue mt-2">
                                      {vendorProfileData?.business_profile
                                        ?.commission_rate
                                        ? `${vendorProfileData?.business_profile?.commission_rate}%`
                                        : 'N/A'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row mb-4 businessDetails">
                            <div className="col-12">
                              <h3 className="secondaryTitle">
                                Business Profile Details
                              </h3>
                            </div>
                            <div className="col-12">
                              <div className="roundImageWrapper roundImage mt-3">
                                <img
                                  src={
                                    businessImage
                                      ? URL.createObjectURL(businessImage)
                                      : values.business_image ||
                                        images.userPlaceholder
                                  }
                                  onError={(e) => {
                                    e.target.src = images?.userPlaceholder;
                                  }}
                                  alt="Business"
                                />
                                <input
                                  id="businessImage"
                                  type="file"
                                  accept="image/*"
                                  className="d-none"
                                  onChange={handleBusinessImageChange}
                                />
                                <label
                                  htmlFor="businessImage"
                                  type="button"
                                  className="changeImageButton"
                                >
                                  <RiImageAddLine size={20} />
                                </label>
                              </div>
                            </div>
                            <div className="col-12 col-xl-10">
                              <div className="row mt-4">
                                <div className="col-6 col-lg-4">
                                  <div className="mb-3">
                                    <CustomInput
                                      label="Business Name"
                                      id="business_name"
                                      name="business_name"
                                      type="text"
                                      value={values.business_name}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={
                                        touched.business_name &&
                                        errors.business_name
                                      }
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="col-6 col-lg-4">
                                  <div className="mb-3">
                                    <CustomSelect
                                      label="Business Category"
                                      id="category_id"
                                      name="category_id"
                                      placeholder="Select Business Category"
                                      className="w-100 fw-normal"
                                      labelClassName="mb-0"
                                      fullWidth
                                      options={
                                        businessFormData?.business_categories
                                      }
                                      disabled={
                                        !businessFormData?.business_categories ||
                                        isBusinessFormDataLoading ||
                                        isBusinessFormDataError
                                      }
                                      value={values.category_id}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={
                                        touched.category_id &&
                                        errors.category_id
                                      }
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="col-6 col-lg-4">
                                  <div className="mb-3">
                                    <CustomSelect
                                      label="Business Type"
                                      id="type_id"
                                      name="type_id"
                                      placeholder="Select Business Type"
                                      className="w-100 fw-normal"
                                      labelClassName="mb-0"
                                      fullWidth
                                      options={
                                        businessFormData?.business_types || []
                                      }
                                      disabled={
                                        !businessFormData?.business_types ||
                                        isBusinessFormDataLoading ||
                                        isBusinessFormDataError
                                      }
                                      value={values.type_id}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={touched.type_id && errors.type_id}
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="col-6 col-lg-4">
                                  <div className="mb-3">
                                    <CustomSelect
                                      label="Country"
                                      id="country_id"
                                      name="country_id"
                                      placeholder="Select Country"
                                      className="w-100 fw-normal"
                                      labelClassName="mb-0"
                                      fullWidth
                                      options={
                                        businessFormData?.countries || []
                                      }
                                      disabled={
                                        !businessFormData?.countries ||
                                        isBusinessFormDataLoading ||
                                        isBusinessFormDataError
                                      }
                                      value={values.country_id}
                                      onChange={(e) => {
                                        setCountryId(e.target.value);
                                        handleChange(e);
                                      }}
                                      onBlur={handleBlur}
                                      error={
                                        touched.country_id && errors.country_id
                                      }
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="col-6 col-lg-4">
                                  <div className="mb-3">
                                    <CustomSelect
                                      label="State"
                                      id="state_id"
                                      name="state_id"
                                      placeholder="Select State"
                                      className="w-100 fw-normal"
                                      labelClassName="mb-0"
                                      fullWidth
                                      options={statesData || []}
                                      disabled={
                                        !statesData ||
                                        isStatesDataLoading ||
                                        isStatesDataError
                                      }
                                      value={values.state_id}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={
                                        touched.state_id && errors.state_id
                                      }
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row mb-4 businessTaxDetails">
                            <div className="col-12">
                              <h3 className="secondaryTitle">
                                Business Tax ID (EIN / VAT ID)
                              </h3>
                            </div>
                            <div className="col-12 col-xl-10">
                              <div className="row mt-4">
                                <div className="col-6">
                                  <div className="mb-3">
                                    <CustomInput
                                      label="EIN"
                                      id="ein"
                                      name="ein"
                                      type="text"
                                      value={values.ein}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={touched.ein && errors.ein}
                                    />
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="mb-3">
                                    <CustomInput
                                      label="VAT ID"
                                      id="vat_id"
                                      name="vat_id"
                                      type="text"
                                      value={values.vat_id}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={touched.vat_id && errors.vat_id}
                                    />
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="mb-3">
                                    <p className="textLabel">
                                      Referral Codes{' '}
                                      <span className="text-danger">*</span>:
                                    </p>
                                    <div className="d-flex align-items-center gap-3 mt-2">
                                      <CustomRadio
                                        label="Enable"
                                        name="referral_code"
                                        id="referral_code_enable"
                                        value={1}
                                        checked={values.referral_code == '1'}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      <CustomRadio
                                        label="Disable"
                                        name="referral_code"
                                        id="referral_code_disable"
                                        value={0}
                                        checked={values.referral_code == '0'}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                    </div>
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
                                  text="Save Changes"
                                  type="submit"
                                  disabled={isSubmitting}
                                />
                                <CustomButton
                                  text="Cancel"
                                  type="button"
                                  className="secondaryButton"
                                  to="/profile"
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
