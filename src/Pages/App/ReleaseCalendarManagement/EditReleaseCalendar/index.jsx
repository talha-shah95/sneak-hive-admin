import React, { useEffect, useState } from 'react';

import { Formik, Form } from 'formik';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { useForm } from '../../../../Hooks/useForm';

import useModalStore from '../../../../Store/ModalStore';

import { statusList } from '../../../../Constants';

import GetReleaseCalendar from '../ReleaseCalendarDetails/Services/GetReleaseCalendar';
import GetBrands from '../../BrandManagement/Services/GetBrands';
import EditReleaseCalendarService from './Services/EditReleaseCalendarService';

import { editReleaseCalendarValidationSchema } from './Validations';

import { showToast } from '../../../../Components/CustomToast';
import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import CustomSelect from '../../../../Components/CustomSelect';
import CustomImageUploader from '../../../../Components/CustomImageUploader';
import LineSkeleton from '../../../../Components/SkeletonLoaders/LineSkeleton';

const EditReleaseCalendar = () => {
  const queryClient = useQueryClient();
  const { showModal, closeModal } = useModalStore();
  const navigate = useNavigate();
  const { id } = useParams();

  const [brandList, setBrandList] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [releaseCalendarImage, setReleaseCalendarImage] = useState(null);

  const {
    data: releaseCalendarDetailsData,
    isLoading: isReleaseCalendarDetailsLoading,
    isError: isReleaseCalendarDetailsError,
    error: releaseCalendarDetailsError,
  } = useQuery({
    queryKey: ['releaseCalendar', 'releaseCalendarDetails', id],
    queryFn: () => GetReleaseCalendar(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

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

  const { mutate: editReleaseCalendarMutation, isLoading } = useForm({
    showSuccessToast: false,

    onSuccess: (response) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message: response.message || 'Release Calendar updated successfully!',
          continueText: 'Ok',
          onContinue: async () => {
            queryClient.invalidateQueries({
              queryKey: ['releaseCalendar', 'releaseCalendarDetails', id],
            });
            queryClient.invalidateQueries({
              queryKey: ['releaseCalendar', { pagination: { page: 1, per_page: 10 }, filters: { status: '' } }],
            });
            closeModal();
            navigate('/release-calendar-management');
          },
        },
      });
    },
    onError: (error) => {
      showToast(
        error?.data?.message.failed || 'Release Calendar edit failed',
        'error'
      );
    },
  });

  const handleSubmit = (values) => {
    const dataToSend = {
      ...values,
    };

    console.log(dataToSend, 'dataToSend');

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

    if (releaseCalendarImage) {
      formDataToSend.append('file', releaseCalendarImage);
    }

    showModal({
      type: 'question',
      modalProps: {
        title: 'Update Release Calendar?',
        message: 'Are you sure you want to update the Release Calendar?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          editReleaseCalendarMutation({
            service: EditReleaseCalendarService,
            data: { id, dataToSend: formDataToSend },
          });
          closeModal();
        },
      },
    });
  };

  const handleReleaseCalendarImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReleaseCalendarImage(file);
    }
  };

  console.log(releaseCalendarDetailsData, 'releaseCalendarDetailsData');

  return (
    <>
      <div className="addReleaseCalendarScreen">
        <div className="row mb-4">
          <div className="col-12 col-xl-6">
            <PageTitle
              title="Edit Release Calendar"
              backButton={true}
              backLink={'/release-calendar-management'}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-12">
            <CustomCard>
              <>
                {isReleaseCalendarDetailsLoading ? (
                  <LineSkeleton lines={10} />
                ) : isReleaseCalendarDetailsError ? (
                  <p className="text-center fs-4 my-4 text-danger">
                    {releaseCalendarDetailsError || 'Something went wrong'}
                  </p>
                ) : (
                  <>
                    <Formik
                      initialValues={{
                        brand_id: releaseCalendarDetailsData?.brand_id,
                        calender_title:
                          releaseCalendarDetailsData?.calender_title,
                        shoe_name: releaseCalendarDetailsData?.shoe_name,
                        shoe_affiliate_link:
                          releaseCalendarDetailsData?.shoe_affiliate_link,
                        publish_date: releaseCalendarDetailsData?.publish_date,
                        release_date: releaseCalendarDetailsData?.release_date,
                        is_active: releaseCalendarDetailsData?.is_active,
                        file:
                          releaseCalendarDetailsData?.shoe_image ||
                          releaseCalendarImage,
                      }}
                      validationSchema={editReleaseCalendarValidationSchema}
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
                                        error={
                                          touched.brand_id && errors.brand_id
                                        }
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
                                            new Date()
                                              .toISOString()
                                              .split('T')[0]
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
                                            new Date()
                                              .toISOString()
                                              .split('T')[0]
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
                                              touched.is_active &&
                                              errors.is_active
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
                                          handleReleaseCalendarImageChange(e);
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
                                    text="Save changes and Post Now"
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
                )}
              </>
            </CustomCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditReleaseCalendar;
