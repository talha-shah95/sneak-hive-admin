import React, { useEffect, useState } from 'react';

import { Formik, Form } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
// import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

import { useForm } from '../../../../../Hooks/useForm';

import useModalStore from '../../../../../Store/ModalStore';

import AddCategoryService from './Services/AddCategoryService';

import { addCategoryValidationSchema } from './Validations';

import PageTitle from '../../../../../Components/PageTitle';
import CustomCard from '../../../../../Components/CustomCard';
import CustomInput from '../../../../../Components/CustomInput';
import CustomButton from '../../../../../Components/CustomButton';
import CustomSelect from '../../../../../Components/CustomSelect';
import CustomImageUploader from '../../../../../Components/CustomImageUploader';
import CustomCheckbox from '../../../../../Components/CustomCheckBox';

// import {
//   beverageTastes,
//   kegSizes,
//   kegRentalDurations,
//   productStatus,
// } from '../Constants';

// import { addProductValidationSchema } from './Validations';

const AddEvent = () => {
  const queryClient = useQueryClient();
  const { showModal, closeModal } = useModalStore();
  const navigate = useNavigate();

  const { mutate: addCategoryMutation, isLoading } = useForm({
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
            queryClient.invalidateQueries(['categories']);
            closeModal();
            navigate('/category-management');
          },
        },
      });
    },
    onError: (error) => {
      console.error('Category add failed:', error);
    },
  });

  const handleSubmit = (values) => {
    const dataToSend = {
      ...values,
    };
    console.log(dataToSend);
    const formDataToSend = new FormData();
    formDataToSend.append('name', dataToSend.name);
    formDataToSend.append('type', dataToSend.type);
    formDataToSend.append('description', dataToSend.description);
    formDataToSend.append('enrollment_price', dataToSend.enrollment_price);
    if (dataToSend.type == 'Onsite' || dataToSend.type == 'Hybrid') {
      formDataToSend.append('location', dataToSend.location);
      formDataToSend.append('map_link', dataToSend.map_link);
    }
    if (dataToSend.type == 'Online' || dataToSend.type == 'Hybrid') {
      formDataToSend.append(
        'online_session_link',
        dataToSend.online_session_link
      );
    }
    formDataToSend.append(
      'includes_alcohol',
      dataToSend.includes_alcohol == true ? 1 : 0
    );
    if (dataToSend.includes_alcohol == true) {
      formDataToSend.append('legal_age', dataToSend.legal_age);
    }
    formDataToSend.append('event_date', dataToSend.event_date);
    formDataToSend.append('start_time', dataToSend.start_time);
    formDataToSend.append('end_time', dataToSend.end_time);
    formDataToSend.append('medias[0]', dataToSend.medias);

    showModal({
      type: 'question',
      modalProps: {
        title: 'Add Event?',
        message: 'Are you sure you want to add the Event?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          addEventMutation({
            service: AddEventService,
            data: formDataToSend,
          });
          closeModal();
        },
      },
    });
  };

  return (
    <>
      <div className="addEventScreen">
        <div className="row mb-4">
          <div className="col-12 col-xl-6">
            <PageTitle
              title="Add Event"
              backButton={true}
              backLink={'/event-management'}
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
                    type: eventTypes[0].value,
                    description: '',
                    enrollment_price: 0,
                    location: '',
                    map_link: '',
                    online_session_link: '',
                    event_date: '',
                    includes_alcohol: '0',
                    legal_age: '',
                    start_time: '18:00:00',
                    end_time: '21:00:00',
                    medias: '',
                  }}
                  validationSchema={addEventValidationSchema}
                  onSubmit={handleSubmit}
                  reinitialize={true}
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
                              <div className="col-lg-6">
                                <div className="row">
                                  <div className="col-12">
                                    <div className="mb-3">
                                      <CustomInput
                                        label="Event Name"
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter Event Name"
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
                                      <CustomInput
                                        label="Event Description"
                                        id="description"
                                        name="description"
                                        type="textarea"
                                        placeholder="Enter Event Description"
                                        rows={4}
                                        value={values.description}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                          touched.description &&
                                          errors.description
                                        }
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="mb-3">
                                      <CustomSelect
                                        label="Event Type"
                                        id="type "
                                        name="type"
                                        placeholder="Select Event Type"
                                        className="w-100 fw-normal"
                                        labelClassName="mb-0"
                                        fullWidth
                                        options={eventTypes}
                                        disabled={!eventTypes}
                                        value={values.type || selectedEventType}
                                        onChange={(e) => {
                                          setSelectedEventType(e.target.value);
                                          handleChange(e);
                                        }}
                                        onBlur={handleBlur}
                                        error={touched.type && errors.type}
                                        required
                                      />
                                    </div>
                                  </div>
                                  {selectedEventType === 'Online' ? (
                                    <>
                                      <div className="col-12">
                                        <div className="mb-3">
                                          <CustomInput
                                            label="Online session Link"
                                            id="online_session_link"
                                            name="online_session_link"
                                            type="text"
                                            placeholder="Enter Online Session Link"
                                            value={values.online_session_link}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={
                                              touched.online_session_link &&
                                              errors.online_session_link
                                            }
                                            required={
                                              selectedEventType === 'Online'
                                            }
                                          />
                                        </div>
                                      </div>
                                    </>
                                  ) : selectedEventType === 'Onsite' ? (
                                    <>
                                      <div className="col-12">
                                        <div className="mb-3">
                                          <CustomInput
                                            label="Location"
                                            id="location"
                                            name="location"
                                            type="text"
                                            placeholder="Enter Location"
                                            value={values.location}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={
                                              touched.location &&
                                              errors.location
                                            }
                                            required={
                                              selectedEventType === 'Onsite'
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="col-12">
                                        <div className="mb-3">
                                          <CustomInput
                                            label="Map Link"
                                            id="map_link"
                                            name="map_link"
                                            type="text"
                                            placeholder="Enter Map Link"
                                            value={values.map_link}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={
                                              touched.map_link &&
                                              errors.map_link
                                            }
                                            required={
                                              selectedEventType === 'Onsite'
                                            }
                                          />
                                        </div>
                                      </div>
                                    </>
                                  ) : selectedEventType === 'Hybrid' ? (
                                    <>
                                      <div className="col-12">
                                        <div className="mb-3">
                                          <CustomInput
                                            label="Online session Link"
                                            id="online_session_link"
                                            name="online_session_link"
                                            type="text"
                                            placeholder="Enter Online Session Link"
                                            value={values.online_session_link}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={
                                              touched.online_session_link &&
                                              errors.online_session_link
                                            }
                                            required={
                                              selectedEventType === 'Hybrid'
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="col-12">
                                        <div className="mb-3">
                                          <CustomInput
                                            label="Location"
                                            id="location"
                                            name="location"
                                            type="text"
                                            placeholder="Enter Location"
                                            value={values.location}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={
                                              touched.location &&
                                              errors.location
                                            }
                                            required={
                                              selectedEventType === 'Hybrid'
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="col-12">
                                        <div className="mb-3">
                                          <CustomInput
                                            label="Map Link"
                                            id="map_link"
                                            name="map_link"
                                            type="text"
                                            placeholder="Enter Map Link"
                                            value={values.map_link}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={
                                              touched.map_link &&
                                              errors.map_link
                                            }
                                            required={
                                              selectedEventType === 'Hybrid'
                                            }
                                          />
                                        </div>
                                      </div>
                                    </>
                                  ) : null}
                                  <div className="col-12">
                                    <div className="mb-3">
                                      <CustomImageUploader
                                        label="Event Images"
                                        required
                                        id="medias"
                                        name="medias"
                                        placeholder="Upload Event Image"
                                        onChange={(e) => {
                                          handleChange({
                                            target: {
                                              name: 'medias',
                                              value: e.target.files[0],
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
                              <div className="col-lg-6">
                                <div className="row">
                                  <div className="col-12">
                                    <div className="mb-3">
                                      <CustomInput
                                        label="Enrollment Price"
                                        id="enrollment_price"
                                        name="enrollment_price"
                                        type="number"
                                        min={0}
                                        placeholder="Enter Enrollment Price"
                                        value={values.enrollment_price}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                          touched.enrollment_price &&
                                          errors.enrollment_price
                                        }
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="mb-3">
                                      <CustomInput
                                        label="Event Date*"
                                        id="event_date"
                                        name="event_date"
                                        type="date"
                                        min={
                                          new Date().toISOString().split('T')[0]
                                        }
                                        placeholder="Enter Event Date"
                                        value={values.event_date}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                          touched.event_date &&
                                          errors.event_date
                                        }
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="mb-3">
                                      <div className="d-flex align-items-center gap-3">
                                        <CustomInput
                                          label="Start Time"
                                          id="start_time"
                                          name="start_time"
                                          type="time"
                                          min={0}
                                          placeholder="Enter Start Time"
                                          value={values.start_time}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          error={
                                            touched.start_time &&
                                            errors.start_time
                                          }
                                          required
                                        />
                                        <CustomInput
                                          label="End Time"
                                          id="end_time"
                                          name="end_time"
                                          type="time"
                                          min={0}
                                          placeholder="Enter End Time"
                                          value={values.end_time}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          error={
                                            touched.end_time && errors.end_time
                                          }
                                          required
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="mb-3">
                                      <CustomCheckbox
                                        label="Does this event include the alcoholic beverages?"
                                        id="includes_alcohol"
                                        checked={includesAlcohol}
                                        onChange={() => {
                                          setIncludesAlcohol(!includesAlcohol);
                                          handleChange({
                                            target: {
                                              name: 'includes_alcohol',
                                              value: !includesAlcohol,
                                            },
                                          });
                                        }}
                                        onBlur={handleBlur}
                                      />
                                    </div>
                                  </div>
                                  {includesAlcohol && (
                                    <>
                                      <div className="col-12">
                                        <div className="mb-3">
                                          <CustomInput
                                            label="Legal Age"
                                            id="legal_age"
                                            name="legal_age"
                                            type="number"
                                            min={0}
                                            placeholder="Enter Legal Age"
                                            value={values.legal_age}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={
                                              touched.legal_age &&
                                              errors.legal_age
                                            }
                                            required={includesAlcohol}
                                          />
                                        </div>
                                      </div>
                                    </>
                                  )}
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
                                text="Add Event"
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

export default AddEvent;
