import React, { useEffect, useState } from 'react';

import { Formik, Form } from 'formik';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useForm } from '../../../../Hooks/useForm';

import useModalStore from '../../../../Store/ModalStore';

import { statusList } from '../../../../Constants';

import AddTertiaryCategoryService from './Services/AddTertiaryCategoryService';
import GetActiveSubCategories from '../Services/GetActiveSubCategories';

import { addTertiaryCategoryValidationSchema } from './Validations';

import { showToast } from '../../../../Components/CustomToast';
import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import CustomSelect from '../../../../Components/CustomSelect';

const AddTertiaryCategory = () => {
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
  }, [activeSubCategoriesList]);

  const { mutate: addTertiaryCategoryMutation, isLoading } = useForm({
    showSuccessToast: false,

    onSuccess: (response) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message:
            response.message || 'Tertiary Category has been added successfully',
          continueText: 'Ok',
          onContinue: async () => {
            queryClient.invalidateQueries({
              queryKey: [
                'tertiaryCategories',
                {
                  pagination: { page: 1, per_page: 10 },
                  filters: { status: '' },
                },
              ],
            });
            closeModal();
            navigate('/tertiary-category-management');
          },
        },
      });
    },
    onError: (error) => {
      showToast(
        error?.data?.message.failed || 'Tertiary Category add failed',
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
        title: 'Add Tertiary Category?',
        message: 'Are you sure you want to add the Tertiary Category?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          addTertiaryCategoryMutation({
            service: AddTertiaryCategoryService,
            data: dataToSend,
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
              title="Add Tertiary Category"
              backButton={true}
              backLink={'/tertiary-category-management'}
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
                    sub_category_id: activeSubCategoriesList[0]?.value,
                    is_active: 1,
                  }}
                  validationSchema={addTertiaryCategoryValidationSchema}
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
                                      touched.sub_category_id && errors.sub_category_id
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
                            </div>
                          </div>
                        </div>
                        <div className="row mb-4">
                          <div className="col-12">
                            <div className="d-flex align-items-center gap-3">
                              <CustomButton
                                loading={isLoading}
                                text="Add Tertiary Category"
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

export default AddTertiaryCategory;
