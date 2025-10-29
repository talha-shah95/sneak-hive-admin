import React, { useEffect, useState } from 'react';

import { Formik, Form } from 'formik';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useForm } from '../../../../Hooks/useForm';

import useModalStore from '../../../../Store/ModalStore';

import { statusList } from '../../../../Constants';

import AddArticleService from './Services/AddArticleService';

import { addArticleValidationSchema } from './Validations';

import { showToast } from '../../../../Components/CustomToast';
import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import CustomSelect from '../../../../Components/CustomSelect';
import GetCategories from '../../CategoryManagement/Services/GetCategories';
import CustomImageUploader from '../../../../Components/CustomImageUploader';

const AddArticle = () => {
  const queryClient = useQueryClient();
  const { showModal, closeModal } = useModalStore();
  const navigate = useNavigate();

  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

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
      setSelectedCategory(tempCategoryList[0]?.value);
    }
  }, [categoryData]);

  const { mutate: addArticleMutation, isLoading } = useForm({
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
            queryClient.invalidateQueries({
              queryKey: ['articles', 'articleDetails'],
            });
            closeModal();
            navigate('/article-management');
          },
        },
      });
    },
    onError: (error) => {
      showToast(error?.data?.message.failed || 'Article add failed', 'error');
    },
  });

  const handleSubmit = (values) => {
    const dataToSend = {
      ...values,
    };

    console.log(dataToSend, 'dataToSend');

    const formDataToSend = new FormData();
    formDataToSend.append('title', dataToSend.title);
    formDataToSend.append('category_id', dataToSend.category_id);
    formDataToSend.append('published_by', dataToSend.published_by);
    formDataToSend.append('details', dataToSend.details);
    formDataToSend.append('link', dataToSend.link);
    formDataToSend.append('is_active', dataToSend.is_active);
    formDataToSend.append('file', dataToSend.file);

    showModal({
      type: 'question',
      modalProps: {
        title: 'Add Article?',
        message: 'Are you sure you want to add the Article?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          addArticleMutation({
            service: AddArticleService,
            data: formDataToSend,
          });
          closeModal();
        },
      },
    });
  };

  return (
    <>
      <div className="addArticleScreen">
        <div className="row mb-4">
          <div className="col-12 col-xl-6">
            <PageTitle
              title="Add Article"
              backButton={true}
              backLink={'/article-management'}
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
                    category_id:
                      selectedCategory || categoryList[0]?.value || '',
                    published_by: '',
                    details: '',
                    link: '',
                    is_active: 1,
                    file: '',
                  }}
                  validationSchema={addArticleValidationSchema}
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
                                    label="Article Title"
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="Enter Article Title"
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
                                    label="Category"
                                    id="category_id "
                                    name="category_id"
                                    placeholder="Select Category"
                                    className="w-100 fw-normal"
                                    labelClassName="mb-0"
                                    fullWidth
                                    options={categoryList || []}
                                    disabled={
                                      !categoryList ||
                                      isCategoryDataLoading ||
                                      isCategoryDataError
                                    }
                                    value={
                                      values.category_id ||
                                      selectedCategory ||
                                      categoryList[0]?.value
                                    }
                                    onChange={(e) => {
                                      setSelectedCategory(e.target.value);
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
                                  <CustomInput
                                    label="Published By"
                                    id="published_by"
                                    name="published_by"
                                    type="text"
                                    placeholder="Enter Published By"
                                    value={values.published_by}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      touched.published_by &&
                                      errors.published_by
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <CustomInput
                                    label="Article Detailed"
                                    id="details"
                                    name="details"
                                    type="textarea"
                                    placeholder="Enter Article Detailed"
                                    rows={4}
                                    value={values.details}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.details && errors.details}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <CustomInput
                                    label="Article Link"
                                    id="link"
                                    name="link"
                                    type="url"
                                    placeholder="Enter Article Link"
                                    value={values.link}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.link && errors.link}
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
                                    label="Upload Article Cover"
                                    required
                                    id="file"
                                    name="file"
                                    placeholder="Upload Article Cover"
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
                                text="Add Article"
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

export default AddArticle;
