import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Formik, Form } from 'formik';
import { useQueryClient, useQuery } from '@tanstack/react-query';
// import Select from 'react-select';

import { useForm } from '../../../../Hooks/useForm';
import { statusList } from '../../../../Constants';

import useModalStore from '../../../../Store/ModalStore';

import EditBrandService from './Services/EditBrandService';

import { editBrandValidationSchema } from './Validations';

import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import CustomSelect from '../../../../Components/CustomSelect';
import CustomImageUploader from '../../../../Components/CustomImageUploader';
import GetBrand from '../BrandDetails/Services/GetBrand';
import LineSkeleton from '../../../../Components/SkeletonLoaders/LineSkeleton';
import { showToast } from '../../../../Components/CustomToast';

// import {
//   beverageTastes,
//   kegSizes,
//   kegRentalDurations,
//   productStatus,
// } from '../Constants';

// import { addProductValidationSchema } from './Validations';

const EditBrand = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { showModal, closeModal } = useModalStore();
  const navigate = useNavigate();
  const [brandImage, setBrandImage] = useState(null);

  const { mutate: editBrandMutation, isLoading } = useForm({
    showSuccessToast: false,

    onSuccess: (response) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message: response.message || 'Brand has been updated successfully!',
          continueText: 'Ok',
          onContinue: async () => {
            queryClient.invalidateQueries({
              queryKey: ['brands', 'brandDetails', id],
            });
            queryClient.invalidateQueries({
              queryKey: [
                'brands',
                {
                  pagination: { page: 1, per_page: 10 },
                  filters: { status: '' },
                },
              ],
            });
            queryClient.invalidateQueries({
              queryKey: ['brands', 'brandDetails'],
            });

            closeModal();
            navigate('/brand-management');
          },
        },
      });
    },
    onError: (error) => {
      showToast(
        error?.data?.message.failed || 'Brand updation failed',
        'error'
      );
    },
  });

  const {
    data: brandDetailsData,
    isLoading: isBrandDetailsLoading,
    isError: isBrandDetailsError,
    error: brandDetailsError,
  } = useQuery({
    queryKey: ['brands', 'brandDetails', id],
    queryFn: () => GetBrand(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  const handleBrandImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBrandImage(file);
    }
  };

  const handleSubmit = (values) => {
    const dataToSend = {
      ...values,
    };
    const formDataToSend = new FormData();
    formDataToSend.append('name', dataToSend.name);
    formDataToSend.append('is_active', dataToSend.is_active);
    if (brandImage) {
      formDataToSend.append('file', brandImage);
    }

    showModal({
      type: 'question',
      modalProps: {
        title: 'Update Brand?',
        message: 'Are you sure you want to update the Brand?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          editBrandMutation({
            service: EditBrandService,
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
              title="Edit Brand"
              backButton={true}
              backLink={'/brand-management'}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-12">
            <CustomCard>
              <>
                {isBrandDetailsLoading ? (
                  <LineSkeleton lines={6} />
                ) : isBrandDetailsError ? (
                  <p className="text-center fs-4 my-4 text-danger">
                    {brandDetailsError || 'Something went wrong'}
                  </p>
                ) : (
                  <>
                    <Formik
                      initialValues={{
                        name: brandDetailsData?.name,
                        is_active: brandDetailsData?.is_active,
                        file: brandDetailsData?.image || '',
                      }}
                      validationSchema={editBrandValidationSchema}
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
                                        label="Brand Name"
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter Brand Name"
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.name && errors.name}
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
                                        label="Brand Image"
                                        required
                                        id="file"
                                        name="file"
                                        placeholder="Upload Brand Logo"
                                        value={brandImage || values.file}
                                        onChange={handleBrandImageChange}
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
                                      isLoading || isBrandDetailsLoading
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

export default EditBrand;
