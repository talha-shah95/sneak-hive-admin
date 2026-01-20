import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Formik, Form } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
// import Select from 'react-select';

import { useForm } from '../../../../Hooks/useForm';
import { statusList } from '../../../../Constants';

import useModalStore from '../../../../Store/ModalStore';

import AddBrandService from './Services/AddBrandService';

// import { addBrandValidationSchema } from './Validations';

import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import CustomSelect from '../../../../Components/CustomSelect';
import CustomImageUploader from '../../../../Components/CustomImageUploader';

// import {
//   beverageTastes,
//   kegSizes,
//   kegRentalDurations,
//   productStatus,
// } from '../Constants';

import { addBrandValidationSchema } from './Validations';
import { showToast } from '../../../../Components/CustomToast';

const AddBrand = () => {
  const queryClient = useQueryClient();
  const { showModal, closeModal } = useModalStore();
  const navigate = useNavigate();

  const { mutate: addBrandMutation, isLoading } = useForm({
    showSuccessToast: false,

    onSuccess: (response) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message: response.message || 'Brand has been added successfully!',
          continueText: 'Ok',
          onContinue: async () => {
            queryClient.invalidateQueries({
              queryKey: ['brands', 'brandDetails'],
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
            closeModal();
            navigate('/brand-management');
          },
        },
      });
    },
    onError: (error) => {
      showToast(
        error?.data?.message.failed || 'Brand addition failed',
        'error'
      );
    },
  });

  const handleSubmit = (values) => {
    const dataToSend = {
      ...values,
    };
    const formDataToSend = new FormData();
    formDataToSend.append('name', dataToSend.name);
    formDataToSend.append('is_active', dataToSend.is_active);
    formDataToSend.append('file', dataToSend.file);

    showModal({
      type: 'question',
      modalProps: {
        title: 'Add Brand?',
        message: 'Are you sure you want to add the Brand?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          addBrandMutation({
            service: AddBrandService,
            data: formDataToSend,
          });
          closeModal();
        },
      },
    });
  };

  return (
    <>
      <div className="addBrandScreen">
        <div className="row mb-4">
          <div className="col-12 col-xl-6">
            <PageTitle
              title="Add New Brand"
              backButton={true}
              backLink={'/brand-management'}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-12">
            <CustomCard>
              <>
                <Formik
                  initialValues={{
                    name: '',
                    is_active: 1,
                    file: '',
                  }}
                  validationSchema={addBrandValidationSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize={true}
                >
                  {({ values, errors, touched, handleChange, handleBlur }) => {
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
                                    onChange={(e) => {
                                      handleChange({
                                        target: {
                                          name: 'file',
                                          value: e.target.files[0],
                                        },
                                      });
                                    }}
                                    onBlur={handleBlur}
                                    value={values.file}
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
                                text="Add"
                                type="submit"
                                disabled={isLoading}
                              />
                            </div>
                          </div>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </>
            </CustomCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBrand;
