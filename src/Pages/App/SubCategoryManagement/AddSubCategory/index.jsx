import React, { useEffect, useState } from 'react';

import { Formik, Form } from 'formik';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useForm } from '../../../../Hooks/useForm';

import useModalStore from '../../../../Store/ModalStore';

import { categoryShowIn } from '../Constants';
import { statusList } from '../../../../Constants';

import AddSubCategoryService from './Services/AddSubCategoryService';
import GetCategories from '../../CategoryManagement/Services/GetCategories';

import { addSubCategoryValidationSchema } from './Validations';

import { showToast } from '../../../../Components/CustomToast';
import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import CustomSelect from '../../../../Components/CustomSelect';

const AddSubCategory = () => {
  const queryClient = useQueryClient();
  const { showModal, closeModal } = useModalStore();
  const navigate = useNavigate();

  const [categoryList, setCategoryList] = useState([]);

  const {
    data: categoryData,
    isLoading: isCategoryDataLoading,
    isError: isCategoryDataError,
  } = useQuery({
    queryKey: ['categoryData'],
    queryFn: () => GetCategories({}, {}),
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

  const { mutate: addSubCategoryMutation, isLoading } = useForm({
    showSuccessToast: false,

    onSuccess: (response) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message:
            response.message || 'Sub Category has been added successfully',
          continueText: 'Ok',
          onContinue: async () => {
            queryClient.invalidateQueries({
              queryKey: [
                'subCategories',
                {
                  pagination: { page: 1, per_page: 10 },
                  filters: { status: '' },
                },
              ],
            });
            closeModal();
            navigate('/sub-category-management');
          },
        },
      });
    },
    onError: (error) => {
      showToast(
        error?.data?.message.failed || 'Sub Category add failed',
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
        title: 'Add Sub Category?',
        message: 'Are you sure you want to add the Sub Category?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          addSubCategoryMutation({
            service: AddSubCategoryService,
            data: dataToSend,
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
              title="Add Sub Category"
              backButton={true}
              backLink={'/sub-category-management'}
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
                    category_id: categoryList[0]?.value,
                    is_active: 1,
                  }}
                  validationSchema={addSubCategoryValidationSchema}
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
                                    label="Show Sub Category in"
                                    id="type "
                                    name="type"
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
                                    label="Parent Category"
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
                                      touched.category_id && errors.category_id
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
                                text="Add Sub Category"
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

export default AddSubCategory;
