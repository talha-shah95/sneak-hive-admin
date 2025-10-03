import React, { useEffect, useState } from 'react';

import { Formik, Form } from 'formik';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { useForm } from '../../../../Hooks/useForm';

import useModalStore from '../../../../Store/ModalStore';

import { statusList } from '../../../../Constants';

import EditBlogService from './Services/EditBlogService';
import GetBlog from '../BlogDetails/Services/GetBlog';
import GetProducts from '../../ProductManagement/Services/GetProducts';

import { editBlogValidationSchema } from './Validations';

import { showToast } from '../../../../Components/CustomToast';
import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import CustomSelect from '../../../../Components/CustomSelect';
import CustomImageUploader from '../../../../Components/CustomImageUploader';
import LineSkeleton from '../../../../Components/SkeletonLoaders/LineSkeleton';

const EditBlog = () => {
  const queryClient = useQueryClient();
  const { showModal, closeModal } = useModalStore();
  const navigate = useNavigate();
  const { id } = useParams();

  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');

  const [blogImage, setBlogImage] = useState(null);

  const {
    data: blogDetailsData,
    isLoading: isBlogDetailsLoading,
    isError: isBlogDetailsError,
    error: blogDetailsError,
  } = useQuery({
    queryKey: ['blogDetails', id],
    queryFn: () => GetBlog(id),
    enabled: true,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: productData,
    isLoading: isProductDataLoading,
    isError: isProductDataError,
  } = useQuery({
    queryKey: ['productData'],
    queryFn: () => GetProducts({}, {}),
    enabled: true,
    retry: 2,
    staleTime: 1000 * 60 * 5,
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

  const { mutate: editBlogMutation, isLoading } = useForm({
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
            queryClient.invalidateQueries(['blogs', 'blogDetails']);
            closeModal();
            navigate('/blogs-management');
          },
        },
      });
    },
    onError: (error) => {
      showToast(error?.data?.message.failed || 'Blog edit failed', 'error');
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
    if (blogImage) {
      formDataToSend.append('content', blogImage);
    }

    showModal({
      type: 'question',
      modalProps: {
        title: 'Update Blog?',
        message: 'Are you sure you want to update the Blog?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          editBlogMutation({
            service: EditBlogService,
            data: { id, formDataToSend },
          });
          closeModal();
        },
      },
    });
  };

  const handleBlogImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBlogImage(file);
    }
  };

  return (
    <>
      <div className="addArticleScreen">
        <div className="row mb-4">
          <div className="col-12 col-xl-6">
            <PageTitle
              title="Edit Blog"
              backButton={true}
              backLink={'/blogs-management'}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-12">
            <CustomCard>
              <>
                {isBlogDetailsLoading ? (
                  <LineSkeleton lines={6} />
                ) : isBlogDetailsError ? (
                  <p className="text-center fs-4 my-4 text-danger">
                    {blogDetailsError || 'Something went wrong'}
                  </p>
                ) : (
                  <>
                    <Formik
                      initialValues={{
                        title: blogDetailsData?.title || '',
                        product_id:
                          blogDetailsData?.product_id ||
                          selectedProduct ||
                          productList[0]?.value ||
                          '',
                        caption: blogDetailsData?.caption || '',
                        is_active: blogDetailsData?.is_active || 1,
                        content_file: blogDetailsData?.content || '',
                      }}
                      validationSchema={editBlogValidationSchema}
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
                                          touched.product_id &&
                                          errors.product_id
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
                                        error={
                                          touched.caption && errors.caption
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
                                        label="Upload Blog Cover"
                                        required
                                        id="content_file"
                                        name="content_file"
                                        placeholder="Upload Blog Cover"
                                        onChange={(e) => {
                                          handleBlogImageChange(e);
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
                                    text="Update Blog"
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

export default EditBlog;
