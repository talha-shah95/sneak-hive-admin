import React, { useEffect, useState } from 'react';

import { Formik, Form } from 'formik';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useForm } from '../../../../Hooks/useForm';

import useModalStore from '../../../../Store/ModalStore';

import { statusList } from '../../../../Constants';

import AddReleaseCalendarService from './Services/AddReleaseCalendarService';
import GetActiveBrands from '../../BrandManagement/Services/GetActiveBrands';

import { addReleaseCalendarValidationSchema } from './Validations';

import { showToast } from '../../../../Components/CustomToast';
import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import CustomSelect from '../../../../Components/CustomSelect';
import CustomImageUploader from '../../../../Components/CustomImageUploader';

const AddReleaseCalendar = () => {
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
    queryFn: () => GetActiveBrands(),
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

  const { mutate: addReleaseCalendarMutation, isLoading } = useForm({
    showSuccessToast: false,

    onSuccess: (response) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message: response.message || 'Release Calendar added successfully!',
          continueText: 'Ok',
          onContinue: async () => {
            queryClient.invalidateQueries({ queryKey: ['releaseCalendar', { pagination: { page: 1, per_page: 10 }, filters: { status: '' } }] });
            closeModal();
            navigate('/release-calendar-management');
          },
        },
      });
    },
    onError: (error) => {
      showToast(
        error?.data?.message.failed || 'Release Calendar add failed',
        'error'
      );
    },
  });

  const handleSubmit = (values) => {
    const dataToSend = {
      ...values,
    };

    const formDataToSend = new FormData();
    formDataToSend.append('brand_id', dataToSend.brand_id);
    formDataToSend.append('calender_title', dataToSend.calender_title);
    formDataToSend.append('shoe_name', dataToSend.shoe_name);
    formDataToSend.append(
      'shoe_affiliate_link',
      dataToSend.shoe_affiliate_link
    );
    formDataToSend.append('publish_date', dataToSend.publish_date);
    formDataToSend.append('release_date', dataToSend.release_date);
    formDataToSend.append('is_active', dataToSend.is_active);
    formDataToSend.append('file', dataToSend.file);

    showModal({
      type: 'question',
      modalProps: {
        title: 'Add Release Calendar?',
        message: 'Are you sure you want to add the Release Calendar?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          addReleaseCalendarMutation({
            service: AddReleaseCalendarService,
            data: formDataToSend,
          });
          closeModal();
        },
      },
    });
  };

  return (
    <>
      <div className="addReleaseCalendarScreen">
        <div className="row mb-4">
          <div className="col-12 col-xl-6">
            <PageTitle
              title="Add Release Calendar"
              backButton={true}
              backLink={'/release-calendar-management'}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-12">
            <CustomCard>
              <>
                <Formik
                  initialValues={{
                    brand_id: '',
                    calender_title: '',
                    shoe_name: '',
                    shoe_affiliate_link: '',
                    publish_date: '',
                    release_date: '',
                    is_active: 1,
                    file: '',
                  }}
                  validationSchema={addReleaseCalendarValidationSchema}
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
                                    label="Calendar Title"
                                    id="calender_title"
                                    name="calender_title"
                                    type="text"
                                    placeholder="Enter Calendar Title"
                                    value={values.calender_title}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      touched.calender_title &&
                                      errors.calender_title
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <CustomSelect
                                    label="Brand Name"
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
                                    label="Shoe Name"
                                    id="shoe_name"
                                    name="shoe_name"
                                    type="text"
                                    placeholder="Enter Shoe Name"
                                    value={values.shoe_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      touched.shoe_name && errors.shoe_name
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <div className="d-flex align-items-center gap-5">
                                    <CustomInput
                                      label="Publish Date"
                                      id="publish_date"
                                      name="publish_date"
                                      type="date"
                                      placeholder="Enter Publish Date"
                                      wrapperClassName="w-100"
                                      value={values.publish_date}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={
                                        touched.publish_date &&
                                        errors.publish_date
                                      }
                                      required
                                      min={
                                        new Date().toISOString().split('T')[0]
                                      }
                                    />
                                    <CustomInput
                                      label="Release Date"
                                      id="release_date"
                                      name="release_date"
                                      type="date"
                                      placeholder="Enter Release Date"
                                      wrapperClassName="w-100"
                                      value={values.release_date}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={
                                        touched.release_date &&
                                        errors.release_date
                                      }
                                      required
                                      min={
                                        new Date().toISOString().split('T')[0]
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <CustomInput
                                    label="Shoe Affiliate Link"
                                    id="shoe_affiliate_link"
                                    name="shoe_affiliate_link"
                                    type="url"
                                    placeholder="Enter Shoe Affiliate Link"
                                    value={values.shoe_affiliate_link}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      touched.shoe_affiliate_link &&
                                      errors.shoe_affiliate_link
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
                                    label="Upload Shoe Image"
                                    required
                                    id="file"
                                    name="file"
                                    placeholder="Upload Shoe Image"
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
                                text="Post Now"
                                type="submit"
                                disabled={isLoading}
                              />
                              <CustomButton
                                loading={isLoading}
                                text="Schedule Release"
                                variant="secondary"
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

export default AddReleaseCalendar;
