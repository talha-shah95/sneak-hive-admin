import React, { useEffect, useState } from 'react';

import { Formik, Form } from 'formik';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useForm } from '../../../../Hooks/useForm';

import useModalStore from '../../../../Store/ModalStore';

import { statusList } from '../../../../Constants';

import AddVideoService from './Services/AddVideoService';
import GetBrands from '../../BrandManagement/Services/GetBrands';

import { addVideoValidationSchema } from './Validations';

import { showToast } from '../../../../Components/CustomToast';
import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import CustomSelect from '../../../../Components/CustomSelect';
import CustomImageUploader from '../../../../Components/CustomImageUploader';
import CustomVideoUploader from '../../../../Components/CustomVideoUploader';

const AddVideo = () => {
  const queryClient = useQueryClient();
  const { showModal, closeModal } = useModalStore();
  const navigate = useNavigate();

  const [brandList, setBrandList] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');

  const {
    data: brandData,
    isLoading: isBrandDataLoading,
    isError: isBrandDataError,
  } = useQuery({
    queryKey: ['brandData'],
    queryFn: () => GetBrands({}, {}),
  });

  useEffect(() => {
    if (brandData) {
      const tempBrandList = brandData.data.map((brand) => {
        return {
          label: brand.name,
          value: brand.id,
        };
      });
      setBrandList(tempBrandList);
      setSelectedBrand(tempBrandList[0]?.value);
    }
  }, [brandData]);

  const { mutate: addVideoMutation, isLoading } = useForm({
    showSuccessToast: false,

    onSuccess: (response) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message: response.message,
          continueText: 'Ok',
          onContinue: async () => {
            queryClient.invalidateQueries({ queryKey: ['videos'] });
            closeModal();
            navigate('/unboxing-videos-management');
          },
        },
      });
    },
    onError: (error) => {
      showToast(error?.data?.message.failed || 'Video add failed', 'error');
    },
  });

  const handleSubmit = (values) => {
    const dataToSend = {
      ...values,
    };

    console.log(dataToSend, 'dataToSend');

    const formDataToSend = new FormData();
    formDataToSend.append('title', dataToSend.title);
    formDataToSend.append('brand_id', dataToSend.brand_id);
    formDataToSend.append('description', dataToSend.description);
    formDataToSend.append('affiliate_link', dataToSend.affiliate_link);
    formDataToSend.append('is_active', dataToSend.is_active);
    formDataToSend.append('thumbnail_file', dataToSend.thumbnail_file);
    formDataToSend.append('video_file', dataToSend.video_file);

    showModal({
      type: 'question',
      modalProps: {
        title: 'Add Video?',
        message: 'Are you sure you want to add the Video?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          addVideoMutation({
            service: AddVideoService,
            data: formDataToSend,
          });
          closeModal();
        },
      },
    });
  };

  return (
    <>
      <div className="addVideoScreen">
        <div className="row mb-4">
          <div className="col-12 col-xl-6">
            <PageTitle
              title="Add Video"
              backButton={true}
              backLink={'/unboxing-videos-management'}
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
                    brand_id: brandList[0]?.value || selectedBrand || '',
                    description: '',
                    affiliate_link: '',
                    is_active: 1,
                    thumbnail_file: '',
                    video_file: '',
                  }}
                  validationSchema={addVideoValidationSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize={true}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    // isSubmitting,
                  }) => {
                    return (
                      <Form>
                        <div className="row mb-4">
                          <div className="col-xl-10">
                            <div className="row">
                              <div className="col-12">
                                <div className="mb-3">
                                  <CustomInput
                                    label="Video Title"
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="Enter Video Title"
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
                                  <CustomSelect
                                    label="Brand"
                                    id="brand_id "
                                    name="brand_id"
                                    placeholder="Select Brand"
                                    className="w-100 fw-normal"
                                    labelClassName="mb-0"
                                    fullWidth
                                    options={brandList || []}
                                    disabled={
                                      !brandList ||
                                      isBrandDataLoading ||
                                      isBrandDataError
                                    }
                                    value={
                                      values.brand_id ||
                                      selectedBrand ||
                                      brandList[0]?.value
                                    }
                                    onChange={(e) => {
                                      setSelectedBrand(e.target.value);
                                      handleChange(e);
                                    }}
                                    onBlur={handleBlur}
                                    error={touched.brand_id && errors.brand_id}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <CustomInput
                                    label="Description"
                                    id="description"
                                    name="description"
                                    type="textarea"
                                    placeholder="Enter Description"
                                    rows={4}
                                    value={values.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      touched.description && errors.description
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <CustomInput
                                    label="Affiliate Link"
                                    id="affiliate_link"
                                    name="affiliate_link"
                                    type="url"
                                    placeholder="Enter Affiliate Link"
                                    value={values.affiliate_link}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      touched.affiliate_link &&
                                      errors.affiliate_link
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
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
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <CustomImageUploader
                                    label="Upload Thumbnail"
                                    required
                                    id="thumbnail_file"
                                    name="thumbnail_file"
                                    placeholder="Upload Thumbnail"
                                    onChange={(e) => {
                                      handleChange({
                                        target: {
                                          name: 'thumbnail_file',
                                          value: e.target.files[0],
                                        },
                                      });
                                    }}
                                    onBlur={handleBlur}
                                    value={values.thumbnail_file}
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <CustomVideoUploader
                                    label="Upload Video"
                                    required
                                    id="video_file"
                                    name="video_file"
                                    placeholder="Upload Video"
                                    onChange={(e) => {
                                      handleChange({
                                        target: {
                                          name: 'video_file',
                                          value: e.target.files[0],
                                        },
                                      });
                                    }}
                                    onBlur={handleBlur}
                                    value={values.video_file}
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

export default AddVideo;
