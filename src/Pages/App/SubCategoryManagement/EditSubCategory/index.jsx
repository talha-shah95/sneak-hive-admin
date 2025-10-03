import React, { useEffect, useState } from 'react';

import { Formik, Form } from 'formik';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { useForm } from '../../../../Hooks/useForm';

import useModalStore from '../../../../Store/ModalStore';

import { categoryShowIn } from '../Constants';
import { statusList } from '../../../../Constants';

import EditSubCategoryService from './Services/EditSubCategoryService';
import GetCategories from '../../CategoryManagement/Services/GetCategories';
import GetSubCategory from '../SubCategoryDetails/Services/GetSubCategory';

import { editSubCategoryValidationSchema } from './Validations';

import { showToast } from '../../../../Components/CustomToast';
import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import CustomSelect from '../../../../Components/CustomSelect';
import LineSkeleton from '../../../../Components/SkeletonLoaders/LineSkeleton';

const EditSubCategory = () => {
  const queryClient = useQueryClient();
  const { showModal, closeModal } = useModalStore();
  const navigate = useNavigate();

  const [categoryList, setCategoryList] = useState([]);
  const { id } = useParams();

  const {
    data: categoryData,
    isLoading: isCategoryDataLoading,
    isError: isCategoryDataError,
  } = useQuery({
    queryKey: ['categoryData'],
    queryFn: () => GetCategories({}, {}),
    retry: 2,
  });

  useEffect(() => {
    if (categoryData) {
      const tempCategoryList = categoryData.data.map((category) => {
        return {
          label: category.name,
          value: category.id,
        };
      });
      setCategoryList(tempCategoryList);
    }
  }, [categoryData]);

  const {
    data: subCategoryDetailsData,
    isLoading: isSubCategoryDetailsLoading,
    isError: isSubCategoryDetailsError,
    error: subCategoryDetailsError,
  } = useQuery({
    queryKey: ['subCategoryDetails', id],
    queryFn: () => GetSubCategory(id),
    retry: 2,
  });

  const { mutate: editSubCategoryMutation, isLoading } = useForm({
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
            queryClient.invalidateQueries(['subCategories']);
            closeModal();
            navigate('/sub-category-management');
          },
        },
      });
    },
    onError: (error) => {
      showToast(
        error?.data?.message.failed || 'Sub Category edit failed',
        'error'
      );
    },
  });

  const handleSubmit = (values) => {
    const dataToSend = {
      ...values,
    };

    showModal({
      type: 'question',
      modalProps: {
        title: 'Edit Sub Category?',
        message: 'Are you sure you want to edit the Sub Category?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          editSubCategoryMutation({
            service: EditSubCategoryService,
            data: { id, dataToSend },
          });
          closeModal();
        },
      },
    });
  };

  return (
    <>
      <div className="addSubCategoryScreen">
        <div className="row mb-4">
          <div className="col-12 col-xl-6">
            <PageTitle
              title="Edit Sub Category"
              backButton={true}
              backLink={'/sub-category-management'}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-12">
            <CustomCard>
              <>
                {isSubCategoryDetailsLoading && <LineSkeleton lines={6} />}
                {isSubCategoryDetailsError && (
                  <div className="text-danger">
                    {subCategoryDetailsError?.data?.message.failed}
                  </div>
                )}
                {subCategoryDetailsData && (
                  <>
                    <Formik
                      initialValues={{
                        name: subCategoryDetailsData?.name,
                        show: subCategoryDetailsData?.show,
                        category_id: subCategoryDetailsData?.category_id,
                        is_active: subCategoryDetailsData?.is_active,
                      }}
                      validationSchema={editSubCategoryValidationSchema}
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
                                        label="Sub Category Name"
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter Sub Category Name"
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
                                        label="Show Sub Category in*"
                                        id="show"
                                        name="show"
                                        placeholder="Show Sub Category In"
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
                                      <CustomSelect
                                        label="Parent Category*"
                                        id="category_id "
                                        name="category_id"
                                        placeholder="Select Parent Category"
                                        className="w-100 fw-normal"
                                        labelClassName="mb-0"
                                        fullWidth
                                        options={categoryList}
                                        disabled={
                                          !categoryList ||
                                          isCategoryDataLoading ||
                                          isCategoryDataError
                                        }
                                        value={values.category_id}
                                        onChange={(e) => {
                                          handleChange(e);
                                        }}
                                        onBlur={handleBlur}
                                        error={
                                          touched.category_id &&
                                          errors.category_id
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
                                    text="Update Sub Category"
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

export default EditSubCategory;
