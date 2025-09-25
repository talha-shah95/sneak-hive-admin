import React from 'react';

import { Formik, Form } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useForm } from '../../../../../Hooks/useForm';

import useModalStore from '../../../../../Store/ModalStore';

import AdRequestService from './Services/AdRequestService';

import { adRequestValidationSchema } from './Validations';

import PageTitle from '../../../../../Components/PageTitle';
import CustomCard from '../../../../../Components/CustomCard';
import CustomInput from '../../../../../Components/CustomInput';
import CustomButton from '../../../../../Components/CustomButton';
import CustomMultiImageUploader from '../../../../../Components/CustomMultiImageUploader';

const AdRequest = () => {
  const queryClient = useQueryClient();
  const { showModal, closeModal } = useModalStore();
  const navigate = useNavigate();

  const { mutate: adRequestMutation, isLoading } = useForm({
    showSuccessToast: false,
    onSuccess: () => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          message:
            'Request sent to the Admin: After acceptance, Your ad will be live on Application',
          continueText: 'Okay',
          onContinue: async () => {
            queryClient.invalidateQueries(['adLogs']);
            closeModal();
            navigate('/ad-logs');
          },
        },
      });
    },
    onError: (error) => {
      console.error('Advertisement request failed:', error);
    },
  });

  const handleSubmit = (values) => {
    const dataToSend = {
      ...values,
    };
    const formDataToSend = new FormData();
    formDataToSend.append('title', dataToSend.title);
    formDataToSend.append('email', dataToSend.email);
    formDataToSend.append('url', dataToSend.url);
    // 👇 Append media files correctly
    if (values.medias && values.medias.length > 0) {
      values.medias.forEach((file, index) => {
        if (file instanceof File) {
          formDataToSend.append(`medias[${index}]`, file);
        }
      });
    }

    showModal({
      type: 'question',
      modalProps: {
        title: 'Request Advertisement?',
        message: 'Are you sure you want to request the advertisement?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          adRequestMutation({
            service: AdRequestService,
            data: formDataToSend,
          });
          closeModal();
        },
      },
    });
  };

  return (
    <>
      <div className="adRequestScreen">
        <div className="row mb-4">
          <div className="col-12 col-xl-6">
            <PageTitle
              title="Request Advertisement"
              backButton={true}
              backLink={'/ad-logs'}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-12">
            <CustomCard>
              <>
                <Formik
                  initialValues={{
                    title: '',
                    email: '',
                    url: '',
                    medias: [],
                  }}
                  validationSchema={adRequestValidationSchema}
                  onSubmit={handleSubmit}
                  reinitialize={true}
                >
                  {({ values, errors, touched, handleChange, handleBlur }) => {
                    return (
                      <Form>
                        <div className="row mb-4">
                          <div className="col-xl-8">
                            <div className="row">
                              <div className="col-12">
                                <div className="row">
                                  <div className="col-12">
                                    <div className="mb-3">
                                      <CustomInput
                                        label="Advertisement Title"
                                        id="title"
                                        name="title"
                                        type="text"
                                        placeholder="Enter Advertisement Title"
                                        value={values.title}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.title && errors.title}
                                        required
                                      />
                                    </div>
                                  </div>

                                  <div className="col-12">
                                    <div className="mb-3">
                                      <CustomInput
                                        label="Email Address"
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter Email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.email && errors.email}
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="mb-3">
                                      <CustomInput
                                        label="Enter URL"
                                        id="url"
                                        name="url"
                                        type="url"
                                        placeholder="Enter URL"
                                        value={values.url}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.url && errors.url}
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="mb-3">
                                      <CustomMultiImageUploader
                                        maxImages={3}
                                        label="Advertisement Images"
                                        required
                                        id="medias"
                                        name="medias"
                                        placeholder="Upload upto 3 images"
                                        onChange={(e) => {
                                          handleChange({
                                            target: {
                                              name: 'medias',
                                              value: e,
                                            },
                                          });
                                        }}
                                        onBlur={handleBlur}
                                        value={values.medias}
                                      />
                                    </div>
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
                                loading={isLoading}
                                text="Send Request"
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

export default AdRequest;
