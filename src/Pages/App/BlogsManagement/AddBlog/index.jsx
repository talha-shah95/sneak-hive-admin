import React, { useEffect, useState } from 'react';

import { Formik, Form } from 'formik';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useForm } from '../../../../Hooks/useForm';

import useModalStore from '../../../../Store/ModalStore';

import { statusList } from '../../../../Constants';

import AddBlogService from './Services/AddBlogService';
import GetProducts from '../../ProductManagement/Services/GetProducts';

import { addBlogValidationSchema } from './Validations';

import { showToast } from '../../../../Components/CustomToast';
import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import CustomSelect from '../../../../Components/CustomSelect';
import GetCategories from '../../CategoryManagement/Services/GetCategories';
import CustomImageUploader from '../../../../Components/CustomImageUploader';

const AddBlog = () => {
  const queryClient = useQueryClient();
  const { showModal, closeModal } = useModalStore();
  const navigate = useNavigate();

  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');

  const {
    data: productData,
    isLoading: isProductDataLoading,
    isError: isProductDataError,
  } = useQuery({
    queryKey: ['productData'],
    queryFn: () => GetProducts({}, {}),
  });

  useEffect(() => {
    if (productData) {
      const tempProductList = productData.data.map((product) => {
        return {
          label: product.name,
          value: product.id,
        };
      });
      setProductList(tempProductList);
      setSelectedProduct(tempProductList[0]?.value);
    }
  }, [productData]);

  const { mutate: addBlogMutation, isLoading } = useForm({
    showSuccessToast: false,

    onSuccess: (response) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message: response.message || 'Blog has been posted successfully!',
          continueText: 'Ok',
          onContinue: async () => {
            queryClient.invalidateQueries({
              queryKey: ['blogs', { pagination: { page: 1, per_page: 10 }, filters: { status: '' } }],
            });
            queryClient.invalidateQueries({
              queryKey: ['blogs', 'blogDetails'],
            });
            closeModal();
            navigate('/blogs-management');
          },
        },
      });
    },
    onError: (error) => {
      showToast(error?.data?.message.failed || 'Blog posting failed', 'error');
    },
  });

  const handleSubmit = (values) => {
    const dataToSend = {
      ...values,
    };

    const formDataToSend = new FormData();
    formDataToSend.append('title', dataToSend.title);
    formDataToSend.append('product_id', dataToSend.product_id);
    formDataToSend.append('caption', dataToSend.caption);
    formDataToSend.append('is_active', dataToSend.is_active);
    formDataToSend.append('content_file', dataToSend.content_file);

    showModal({
      type: 'question',
      modalProps: {
        title: 'Post Blog?',
        message: 'Are you sure you want to add the Blog?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          addBlogMutation({
            service: AddBlogService,
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
              title="Add New Blog"
              backButton={true}
              backLink={'/blogs-management'}
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
                    product_id: selectedProduct || productList[0]?.value || '',
                    caption: '',
                    is_active: 1,
                    content_file: '',
                  }}
                  validationSchema={addBlogValidationSchema}
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
                                    label="Blog Title"
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="Enter Blog Title"
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
                                    label="Link a Product"
                                    id="product_id "
                                    name="product_id"
                                    placeholder="Select Product"
                                    className="w-100 fw-normal"
                                    labelClassName="mb-0"
                                    fullWidth
                                    options={productList || []}
                                    disabled={
                                      !productList ||
                                      isProductDataLoading ||
                                      isProductDataError
                                    }
                                    value={
                                      values.product_id ||
                                      selectedProduct ||
                                      productList[0]?.value
                                    }
                                    onChange={(e) => {
                                      setSelectedProduct(e.target.value);
                                      handleChange(e);
                                    }}
                                    onBlur={handleBlur}
                                    error={
                                      touched.product_id && errors.product_id
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <CustomInput
                                    label="Blog Caption"
                                    id="caption"
                                    name="caption"
                                    type="textarea"
                                    placeholder="Enter Blog Caption"
                                    rows={4}
                                    value={values.caption}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.caption && errors.caption}
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
                                    label="Upload Blog Cover"
                                    required
                                    id="content_file"
                                    name="content_file"
                                    placeholder="Upload Blog Cover"
                                    onChange={(e) => {
                                      handleChange({
                                        target: {
                                          name: 'content_file',
                                          value: e.target.files[0],
                                        },
                                      });
                                    }}
                                    onBlur={handleBlur}
                                    value={values.content_file}
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
                                text="Post"
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

export default AddBlog;
