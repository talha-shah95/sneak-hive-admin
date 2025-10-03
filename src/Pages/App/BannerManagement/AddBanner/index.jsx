import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Formik, Form } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
// import Select from 'react-select';

import { useForm } from '../../../../Hooks/useForm';
import { statusList } from '../../../../Constants';

import useModalStore from '../../../../Store/ModalStore';

import AddBannerService from './Services/AddBannerService';

import { addBannerValidationSchema } from './Validations';

import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import CustomSelect from '../../../../Components/CustomSelect';
import CustomImageUploader from '../../../../Components/CustomImageUploader';

const AddBanner = () => {
  const queryClient = useQueryClient();
  const { showModal, closeModal } = useModalStore();
  const navigate = useNavigate();

  const { mutate: addBannerMutation, isLoading } = useForm({
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
      console.error('Banner add failed:', error);
    },
  });

  const handleSubmit = (values) => {
    const dataToSend = {
      ...values,
    };
    const formDataToSend = new FormData();
    formDataToSend.append('heading', dataToSend.heading);
    formDataToSend.append('is_active', dataToSend.is_active);
    formDataToSend.append('file', dataToSend.file);

    showModal({
      type: 'question',
      modalProps: {
        title: 'Add Banner?',
        message: 'Are you sure you want to add the Banner?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          addBannerMutation({
            service: AddBannerService,
            data: formDataToSend,
          });
          closeModal();
        },
      },
    });
  };

  return (
    <>
      <div className="addBannerScreen">
        <div className="row mb-4">
          <div className="col-12 col-xl-6">
            <PageTitle
              title="Add New Banner"
              backButton={true}
              backLink={'/banner-management'}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-12">
            <CustomCard>
              <>
                <Formik
                  initialValues={{
                    heading: '',
                    is_active: 1,
                    file: '',
                  }}
                  validationSchema={addBannerValidationSchema}
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
                                    label="Add Introductory Heading:"
                                    id="heading"
                                    name="heading"
                                    type="text"
                                    placeholder="Enter Introductory Heading"
                                    value={values.heading}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.heading && errors.heading}
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
                                    label="Add Introductory banner"
                                    required
                                    id="file"
                                    name="file"
                                    placeholder="Add Introductory banner"
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

export default AddBanner;
