import React, { useEffect, useState } from 'react';

import { Formik, Form } from 'formik';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { useForm } from '../../../../Hooks/useForm';

import useModalStore from '../../../../Store/ModalStore';

import { statusList } from '../../../../Constants';

import GetTertiaryCategoryDetails from '../TertiaryCategoryDetails/Services/GetTertiaryCategoryDetails';
import GetActiveSubCategories from '../Services/GetActiveSubCategories';
import EditTertiaryCategoryService from './Services/EditTertiaryCategoryService';

import { editTertiaryCategoryValidationSchema } from './Validations';

import { showToast } from '../../../../Components/CustomToast';
import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import CustomSelect from '../../../../Components/CustomSelect';
import LineSkeleton from '../../../../Components/SkeletonLoaders/LineSkeleton';

const EditTertiaryCategory = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { showModal, closeModal } = useModalStore();
  const navigate = useNavigate();

  const [activeSubCategoriesList, setActiveSubCategoriesList] = useState([]);

  const {
    data: activeSubCategoriesData,
    isLoading: isActiveSubCategoriesDataLoading,
    isError: isActiveSubCategoriesDataError,
  } = useQuery({
    queryKey: ['activeSubCategories'],
    queryFn: () => GetActiveSubCategories(),
    retry: 2,
  });

  const {
    data: tertiaryCategoryDetailsData,
    isLoading: isTertiaryCategoryDetailsLoading,
    isError: isTertiaryCategoryDetailsError,
    error: tertiaryCategoryDetailsError,
  } = useQuery({
    queryKey: ['tertiaryCategories', 'tertiaryCategoryDetails', id],
    queryFn: () => GetTertiaryCategoryDetails(id),
    retry: 2,
  });

  useEffect(() => {
    if (activeSubCategoriesData) {
      const tempActiveSubCategoriesList = activeSubCategoriesData.data.map((activeSubCategory) => {
        return {
          label: activeSubCategory.name,
          value: activeSubCategory.id,
        };
      });
      setActiveSubCategoriesList(tempActiveSubCategoriesList);
    }
  }, [activeSubCategoriesData]);

  const { mutate: editTertiaryCategoryMutation, isLoading } = useForm({
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
            queryClient.invalidateQueries({ queryKey: ['tertiaryCategories', 'tertiaryCategoryDetails', id] });
            queryClient.invalidateQueries({ queryKey: ['tertiaryCategories'] });
            closeModal();
            navigate('/tertiary-category-management');
          },
        },
      });
    },
    onError: (error) => {
      showToast(
        error?.data?.message.failed || 'Tertiary Category edit failed',
        'error'
      );
    },
  });

  const handleSubmit = (values) => {
    const dataToSend = {
      ...values,
      show: "side_menu",
    };

    showModal({
      type: 'question',
      modalProps: {
        title: 'Edit Tertiary Category?',
        message: 'Are you sure you want to edit the Tertiary Category?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          editTertiaryCategoryMutation({
            service: EditTertiaryCategoryService,
            data: { id, dataToSend },
          });
          closeModal();
        },
      },
    });
  };

  return (
    <>
      <div className="addTertiaryCategoryScreen">
        <div className="row mb-4">
          <div className="col-12 col-xl-6">
            <PageTitle
              title="Edit Tertiary Category"
              backButton={true}
              backLink={'/tertiary-category-management'}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-12">
            <CustomCard>
              <>
                {isTertiaryCategoryDetailsLoading && <LineSkeleton lines={6} />}
                {isTertiaryCategoryDetailsError && (
                  <div className="text-danger">
                    {tertiaryCategoryDetailsError?.data?.message.failed}
                  </div>
                )}
                {tertiaryCategoryDetailsData && (
                  <>
                    <Formik
                      initialValues={{
                        name: tertiaryCategoryDetailsData?.name,
                        sub_category_id: tertiaryCategoryDetailsData?.sub_category_id,
                        is_active: tertiaryCategoryDetailsData?.is_active,
                      }}
                      validationSchema={editTertiaryCategoryValidationSchema}
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
                              <div className="col-xl-10">
                                <div className="row">
                                  <div className="col-12">
                                    <div className="mb-3">
                                      <CustomInput
                                        label="Tertiary Category Name"
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter Tertiary Category Name"
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
                                        label="Sub Category"
                                        id="sub_category_id "
                                        name="sub_category_id"
                                        placeholder="Select Sub Category"
                                        className="w-100 fw-normal"
                                        labelClassName="mb-0"
                                        fullWidth
                                        options={activeSubCategoriesList}
                                        disabled={
                                          !activeSubCategoriesList ||
                                          isActiveSubCategoriesDataLoading ||
                                          isActiveSubCategoriesDataError
                                        }
                                        value={values.sub_category_id}
                                        onChange={(e) => {
                                          handleChange(e);
                                        }}
                                        onBlur={handleBlur}
                                        error={
                                          touched.sub_category_id &&
                                          errors.sub_category_id
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
                                </div>
                              </div>
                            </div>
                            <div className="row mb-4">
                              <div className="col-12">
                                <div className="d-flex align-items-center gap-3">
                                  <CustomButton
                                    loading={isLoading}
                                    text="Update Tertiary Category"
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

export default EditTertiaryCategory;
