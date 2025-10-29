import React from 'react';

import { Formik, Form } from 'formik';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { useForm } from '../../../../Hooks/useForm';

import useModalStore from '../../../../Store/ModalStore';

import { categoryShowIn } from '../Constants';
import { statusList } from '../../../../Constants';

import GetCategory from '../CategoryDetails/Services/GetCategory';
import EditCategoryService from './Services/EditCategoryService';

import { editCategoryValidationSchema } from './Validations';

import { showToast } from '../../../../Components/CustomToast';
import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import CustomSelect from '../../../../Components/CustomSelect';
import LineSkeleton from '../../../../Components/SkeletonLoaders/LineSkeleton';

const EditCategory = () => {
  const queryClient = useQueryClient();
  const { showModal, closeModal } = useModalStore();
  const navigate = useNavigate();

  const { id } = useParams();

  const {
    data: categoryDetailsData,
    isLoading: isCategoryDetailsLoading,
    isError: isCategoryDetailsError,
    error: categoryDetailsError,
  } = useQuery({
    queryKey: ['categories', 'categoryDetails', id],
    queryFn: () => GetCategory(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  const { mutate: editCategoryMutation, isLoading } = useForm({
    showSuccessToast: false,

    onSuccess: (response) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          message: response.message || 'Category has been updated successfully',
          hideClose: true,
          continueText: 'Ok',
          onContinue: async () => {
            queryClient.invalidateQueries({
              queryKey: ['categories', 'categoryDetails', id],
            });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            closeModal();
            navigate('/category-management');
          },
        },
      });
    },
    onError: (error) => {
      showToast(error?.data?.message.failed || 'Category edit failed', 'error');
    },
  });

  const handleSubmit = (values) => {
    const dataToSend = {
      ...values,
    };

    showModal({
      type: 'question',
      modalProps: {
        title: 'Edit Category?',
        message: 'Are you sure you want to update the Category?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          editCategoryMutation({
            service: EditCategoryService,
            data: { id, dataToSend },
          });
          closeModal();
        },
      },
    });
  };

  return (
    <>
      <div className="editCategoryScreen">
        <div className="row mb-4">
          <div className="col-12 col-xl-6">
            <PageTitle
              title="Edit Category"
              backButton={true}
              backLink={'/category-management'}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-12">
            <CustomCard>
              <>
                {isCategoryDetailsLoading ? (
                  <LineSkeleton lines={6} />
                ) : isCategoryDetailsError ? (
                  <p className="text-center fs-4 my-4 text-danger">
                    {categoryDetailsError || 'Something went wrong'}
                  </p>
                ) : (
                  <Formik
                    initialValues={{
                      name: categoryDetailsData?.name,
                      show: categoryDetailsData?.show,
                      is_active: categoryDetailsData?.is_active,
                    }}
                    validationSchema={editCategoryValidationSchema}
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
                                      label="Show Category in"
                                      id="show"
                                      name="show"
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
                                            touched.is_active &&
                                            errors.is_active
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
                                  text="Update Category"
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
                )}
              </>
            </CustomCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCategory;
