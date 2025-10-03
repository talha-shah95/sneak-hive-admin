import React from 'react';

import { Formik, Form } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useForm } from '../../../../Hooks/useForm';

import useModalStore from '../../../../Store/ModalStore';

import { categoryShowIn } from '../Constants';
import { statusList } from '../../../../Constants';

import AddCategoryService from './Services/AddCategoryService';

import { addCategoryValidationSchema } from './Validations';

import { showToast } from '../../../../Components/CustomToast';
import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import CustomSelect from '../../../../Components/CustomSelect';

const AddCategory = () => {
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
          continueText: 'Ok',
          onContinue: async () => {
            queryClient.invalidateQueries(['categories']);
            closeModal();
            navigate('/category-management');
          },
        },
      });
    },
    onError: (error) => {
      showToast(error?.data?.message.failed || 'Category add failed', 'error');
    },
  });

  const handleSubmit = (values) => {
    const dataToSend = {
      ...values,
    };

    showModal({
      type: 'question',
      modalProps: {
        title: 'Add Category?',
        message: 'Are you sure you want to add the Category?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          addCategoryMutation({
            service: AddCategoryService,
            data: dataToSend,
          });
          closeModal();
        },
      },
    });
  };

  return (
    <>
      <div className="addCategoryScreen">
        <div className="row mb-4">
          <div className="col-12 col-xl-6">
            <PageTitle
              title="Add Category"
              backButton={true}
              backLink={'/category-management'}
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
                    show: categoryShowIn[0]?.value,
                    is_active: 1,
                  }}
                  validationSchema={addCategoryValidationSchema}
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
                                    label="Category Name"
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter Category Name"
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
                                    label="Show Category in*"
                                    id="type "
                                    name="type"
                                    placeholder="Show Category In"
                                    className="w-100 fw-normal"
                                    labelClassName="mb-0"
                                    fullWidth
                                    options={categoryShowIn}
                                    disabled={!categoryShowIn}
                                    value={values.show}
                                    onChange={(e) => {
                                      handleChange(e);
                                    }}
                                    onBlur={handleBlur}
                                    error={touched.show && errors.show}
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
                            </div>
                          </div>
                        </div>
                        <div className="row mb-4">
                          <div className="col-12">
                            <div className="d-flex align-items-center gap-3">
                              <CustomButton
                                loading={isLoading}
                                text="Add Category"
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

export default AddCategory;
