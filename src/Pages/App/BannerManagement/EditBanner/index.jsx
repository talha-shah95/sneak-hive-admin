import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Formik, Form } from 'formik';
import { useQueryClient, useQuery } from '@tanstack/react-query';
// import Select from 'react-select';

import { useForm } from '../../../../Hooks/useForm';
import { statusList } from '../../../../Constants';

import useModalStore from '../../../../Store/ModalStore';

import GetBanner from '../BannerDetails/Services/GetBanner';
import EditBannerService from './Services/EditBannerService';

import { editBannerValidationSchema } from './Validations';

import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import CustomSelect from '../../../../Components/CustomSelect';
import CustomImageUploader from '../../../../Components/CustomImageUploader';
import LineSkeleton from '../../../../Components/SkeletonLoaders/LineSkeleton';

// import {
//   beverageTastes,
//   kegSizes,
//   kegRentalDurations,
//   productStatus,
// } from '../Constants';

// import { addProductValidationSchema } from './Validations';

const EditBanner = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { showModal, closeModal } = useModalStore();
  const navigate = useNavigate();
  const [bannerImage, setBannerImage] = useState(null);

  const { mutate: editBannerMutation, isLoading } = useForm({
    showSuccessToast: false,

    onSuccess: (response) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message: response.message,
          continueText: 'Okay',
          onContinue: async () => {
            queryClient.invalidateQueries(['banners', 'bannerDetails']);
            closeModal();
            navigate('/banner-management');
          },
        },
      });
    },
    onError: (error) => {
      console.error('Banner edit failed:', error);
    },
  });

  const {
    data: bannerDetailsData,
    isLoading: isBannerDetailsLoading,
    isError: isBannerDetailsError,
    error: bannerDetailsError,
  } = useQuery({
    queryKey: ['bannerDetails', id],
    queryFn: () => GetBanner(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImage(file);
    }
  };

  const handleSubmit = (values) => {
    const dataToSend = {
      ...values,
    };
    const formDataToSend = new FormData();
    formDataToSend.append('heading', dataToSend.heading);
    formDataToSend.append('is_active', dataToSend.is_active);
    if (bannerImage) {
      formDataToSend.append('file', bannerImage);
    }

    showModal({
      type: 'question',
      modalProps: {
        title: 'Edit Banner?',
        message: 'Are you sure you want to edit the Banner?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          editBannerMutation({
            service: EditBannerService,
            data: { id, formDataToSend },
          });
          closeModal();
        },
      },
    });
  };

  return (
    <>
      <div className="editBrandScreen">
        <div className="row mb-4">
          <div className="col-12 col-xl-6">
            <PageTitle
              title="Edit Banner"
              backButton={true}
              backLink={'/banner-management'}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-12">
            <CustomCard>
              <>
                {isBannerDetailsLoading ? (
                  <LineSkeleton lines={6} />
                ) : isBannerDetailsError ? (
                  <p className="text-center fs-4 my-4 text-danger">
                    {bannerDetailsError || 'Something went wrong'}
                  </p>
                ) : (
                  <>
                    <Formik
                      initialValues={{
                        heading: bannerDetailsData?.heading,
                        is_active: bannerDetailsData?.is_active,
                        file: bannerDetailsData?.image || '',
                      }}
                      validationSchema={editBannerValidationSchema}
                      onSubmit={handleSubmit}
                      enableReinitialize={true}
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                      }) => {
                        return (
                          <Form>
                            <div className="row mb-4">
                              <div className="col-md-10 col-lg-8">
                                <div className="row">
                                  <div className="col-12">
                                    <div className="mb-3">
                                      <CustomInput
                                        label="Introductory Heading"
                                        id="heading"
                                        name="heading"
                                        type="text"
                                        placeholder="Enter Introductory Heading"
                                        value={values.heading}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                          touched.heading && errors.heading
                                        }
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="mb-3">
                                      <CustomSelect
                                        label="Status"
                                        id="is_active "
                                        name="is_active"
                                        placeholder="Select Status"
                                        className="w-100 fw-normal"
                                        labelClassName="mb-0"
                                        fullWidth
                                        options={statusList}
                                        disabled={!statusList}
                                        value={values.is_active}
                                        onChange={(e) => {
                                          handleChange(e);
                                        }}
                                        onBlur={handleBlur}
                                        error={
                                          touched.is_active && errors.is_active
                                        }
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="mb-3">
                                      <CustomImageUploader
                                        label="Introductory Banner"
                                        required
                                        id="file"
                                        name="file"
                                        placeholder="Upload Introductory Banner"
                                        value={values.file}
                                        onChange={handleBannerImageChange}
                                        onBlur={handleBlur}
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
                                    loading={isLoading}
                                    text="Update"
                                    type="submit"
                                    disabled={
                                      isLoading || isBannerDetailsLoading
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </Form>
                        );
                      }}
                    </Formik>
                  </>
                )}
              </>
            </CustomCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditBanner;
