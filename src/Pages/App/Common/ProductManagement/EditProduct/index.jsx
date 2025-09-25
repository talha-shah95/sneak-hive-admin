import React, { useEffect, useState } from 'react';

import { Formik, Form } from 'formik';
import { useQuery, useQueryClient } from '@tanstack/react-query';
// import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';

import { useForm } from '../../../../../Hooks/useForm';

import useModalStore from '../../../../../Store/ModalStore';

import GetProductDetails from '../ProductDetails/Services/GetProductDetails';
import GetProductFormData from '../../../../../Services/getProductFormData';
import GetProductSubCategoryData from '../../../../../Services/getProductSubCategoryData';
import updateProductService from './Services/UpdateProduct';

import PageTitle from '../../../../../Components/PageTitle';
import CustomCard from '../../../../../Components/CustomCard';
import CustomInput from '../../../../../Components/CustomInput';
import CustomButton from '../../../../../Components/CustomButton';
import CustomSelect from '../../../../../Components/CustomSelect';
import CustomMultiImageUploader from '../../../../../Components/CustomMultiImageUploader';

import CustomRadio from '../../../../../Components/CustomRadio';

import './style.css';

import {
  beverageTastes,
  kegSizes,
  kegRentalDurations,
  productStatus,
} from '../Constants';
import { addProductValidationSchema } from './Validations';
import LineSkeleton from '../../../../../Components/SkeletonLoaders/LineSkeleton';

const EditProduct = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { showModal, closeModal } = useModalStore();

  const navigate = useNavigate();

  const [categoryId, setCategoryId] = useState(null);
  const [subCategoryId, setSubCategoryId] = useState(null);

  const {
    data: productDetailsData,
    isLoading: isProductDetailsLoading,
    isError: isProductDetailsError,
    error: productDetailsError,
  } = useQuery({
    queryKey: ['productDetails', id],
    queryFn: () => GetProductDetails(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  const { mutate: updateProductMutation, isLoading } = useForm({
    showSuccessToast: false,

    onSuccess: (response) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Product updated successfully!',
          message: response.message,
          continueText: 'Okay',
          onContinue: async () => {
            queryClient.invalidateQueries(['products']);
            closeModal();
            navigate('/product-management');
          },
        },
      });
    },
    onError: (error) => {
      console.error('Product update failed:', error);
    },
  });

  const {
    data: productFormData,
    isLoading: isProductFormDataLoading,
    isError: isProductFormDataError,
  } = useQuery({
    queryKey: ['productFormData'],
    queryFn: () => GetProductFormData(),
  });

  const {
    data: subCategoryData,
    isLoading: isSubCategoryDataLoading,
    isError: isSubCategoryDataError,
  } = useQuery({
    queryKey: ['subCategoryData', categoryId],
    queryFn: () => GetProductSubCategoryData(categoryId),
  });

  useEffect(() => {
    if (productDetailsData?.category_id && productFormData) {
      setCategoryId(
        productDetailsData?.category_id ||
          productFormData?.product_categories[0]?.value
      );
    }
  }, [productDetailsData, productFormData]);

  useEffect(() => {
    if (categoryId && productFormData && productDetailsData) {
      setSubCategoryId(
        productDetailsData?.sub_category_id ||
          productFormData?.product_sub_categories[0]?.value
      );
    }
  }, [productDetailsData, categoryId, productFormData]);

  const handleSubmit = (values) => {
    // Filter out invalid media objects and keep only those with id
    const oldMediaList = productDetailsData?.medias.filter(
      (media) => media?.id
    );
    const filesOnly = values.medias.filter((item) => item instanceof File);
    const newMediaList = values.medias.filter((media) => media?.id);
    const newMediaIds = newMediaList.map((media) => media.id);
    const removedMediaIds = oldMediaList
      .filter((media) => !newMediaIds.includes(media.id))
      .map((media) => media.id);

    const dataToSend = {
      ...values,
      category_id: categoryId,
      sub_category_id: subCategoryId,
      deposit: values.deposit || 0,
    };
    const formDataToSend = new FormData();
    formDataToSend.append('preference_id', dataToSend.preference_id);
    formDataToSend.append('category_id', categoryId);
    formDataToSend.append('sub_category_id', subCategoryId);
    formDataToSend.append('title', dataToSend.title);
    formDataToSend.append('description', dataToSend.description);
    formDataToSend.append('quantity', dataToSend.quantity);
    formDataToSend.append('package_type', dataToSend.package_type);
    formDataToSend.append('beverage_taste', dataToSend.beverage_taste);
    formDataToSend.append('is_keg', dataToSend.is_keg);
    formDataToSend.append('keg_size', dataToSend.keg_size);
    formDataToSend.append('accessories', dataToSend.accessories);
    formDataToSend.append(
      'keg_rental_duration',
      dataToSend.keg_rental_duration
    );
    formDataToSend.append('deposit', dataToSend.deposit);
    formDataToSend.append('price', dataToSend.price);
    formDataToSend.append('status', dataToSend.status);
    // 👇 Append media files correctly
    if (filesOnly && filesOnly.length > 0) {
      filesOnly.forEach((file, index) => {
        if (file instanceof File) {
          formDataToSend.append(`medias[${index}]`, file);
        }
      });
    }
    if (removedMediaIds && removedMediaIds.length > 0) {
      removedMediaIds.forEach((id, index) => {
        formDataToSend.append(`delete_media_ids[${index}]`, id);
      });
    }
    showModal({
      type: 'question',
      modalProps: {
        title: 'Update Product?',
        message: 'Are you sure you want to update the product?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          updateProductMutation({
            service: updateProductService,
            data: { id, data: formDataToSend },
          });
          closeModal();
        },
      },
    });
  };

  return (
    <>
      <div className="addProductScreen">
        <div className="row mb-4">
          <div className="col-12 col-xl-6">
            <PageTitle
              title="Update Product"
              backButton={true}
              backLink={'/product-management'}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-12">
            <CustomCard>
              <>
                {isProductDetailsError ? (
                  <p className="text-center fs-4 my-4 text-danger">
                    {productDetailsError || 'Something went wrong'}
                  </p>
                ) : (
                  <>
                    {isProductDetailsLoading ? (
                      <LineSkeleton lines={10} />
                    ) : (
                      <>
                        <Formik
                          initialValues={{
                            title: productDetailsData?.title || '',
                            description: productDetailsData?.description || '',
                            preference_id:
                              productDetailsData?.preference_id || '',

                            category_id:
                              categoryId ||
                              productDetailsData?.category_id ||
                              '',
                            sub_category_id: subCategoryId || '',
                            quantity: productDetailsData?.quantity || 0,
                            package_type:
                              productFormData?.product_package_types[0]
                                ?.value || '',
                            beverage_taste: beverageTastes[0]?.value || '',
                            is_keg: 0,
                            keg_size: kegSizes[0]?.value || '',
                            keg_rental_duration:
                              kegRentalDurations[0]?.value || '',
                            deposit: productDetailsData?.deposit || 0,
                            price: productDetailsData?.price || 0,
                            accessories: productDetailsData?.accessories || '',
                            status: productDetailsData?.status || 1,
                            medias: productDetailsData?.medias || [],
                          }}
                          validationSchema={addProductValidationSchema}
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
                                                label="Product Title"
                                                id="title"
                                                name="title"
                                                type="text"
                                                placeholder="Enter Product Title"
                                                value={values.title}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={
                                                  touched.title && errors.title
                                                }
                                                required
                                              />
                                            </div>
                                          </div>
                                          <div className="col-12">
                                            <div className="mb-3">
                                              <CustomInput
                                                label="Product Description"
                                                id="description"
                                                name="description"
                                                type="textarea"
                                                placeholder="Enter Product Description"
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
                                                label="Beverage Type"
                                                id="preference_id "
                                                name="preference_id"
                                                placeholder="Select Beverage Type"
                                                className="w-100 fw-normal"
                                                labelClassName="mb-0"
                                                fullWidth
                                                options={
                                                  productFormData?.product_beverage_types
                                                }
                                                disabled={
                                                  !productFormData?.product_beverage_types ||
                                                  isProductFormDataLoading ||
                                                  isProductFormDataError
                                                }
                                                value={values.preference_id}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={
                                                  touched.preference_id &&
                                                  errors.preference_id
                                                }
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
                                                options={
                                                  productFormData?.product_categories
                                                }
                                                disabled={
                                                  !productFormData?.product_categories ||
                                                  isProductFormDataLoading ||
                                                  isProductFormDataError
                                                }
                                                value={categoryId}
                                                onChange={(e) => {
                                                  setCategoryId(e.target.value);
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
                                              <CustomSelect
                                                label="Sub Category"
                                                id="sub_category_id "
                                                name="sub_category_id"
                                                placeholder="Select Sub Category"
                                                className="w-100 fw-normal"
                                                labelClassName="mb-0"
                                                fullWidth
                                                options={subCategoryData}
                                                disabled={
                                                  !subCategoryData ||
                                                  isSubCategoryDataLoading ||
                                                  isSubCategoryDataError
                                                }
                                                value={subCategoryId}
                                                onChange={(e) => {
                                                  setSubCategoryId(
                                                    e.target.value
                                                  );
                                                  handleChange({
                                                    target: {
                                                      name: 'sub_category_id',
                                                      value: e.target.value,
                                                    },
                                                  });
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
                                              <CustomInput
                                                label="Quantity"
                                                id="quantity"
                                                name="quantity"
                                                type="number"
                                                placeholder="Enter Quantity"
                                                value={values.quantity}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={
                                                  touched.quantity &&
                                                  errors.quantity
                                                }
                                                required
                                              />
                                            </div>
                                          </div>
                                          <div className="col-12">
                                            <div className="mb-3">
                                              <CustomMultiImageUploader
                                                maxImages={12}
                                                multiple
                                                label="Product Images"
                                                required
                                                id="medias"
                                                name="medias"
                                                placeholder="Upload Product Images"
                                                onChange={(e) => {
                                                  handleChange({
                                                    target: {
                                                      name: 'medias',
                                                      value: e,
                                                    },
                                                  });
                                                }}
                                                onBlur={handleBlur}
                                                value={values.medias}
                                              />
                                              <p className="text14 colorGrayDark fw-normal">
                                                Note: At least 3 images are
                                                required
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-lg-6">
                                        <div className="row">
                                          <div className="col-12">
                                            <div className="mb-3">
                                              <CustomSelect
                                                label="Package Type"
                                                id="package_type "
                                                name="package_type"
                                                placeholder="Select Package Type"
                                                className="w-100 fw-normal"
                                                labelClassName="mb-0"
                                                fullWidth
                                                options={
                                                  productFormData?.product_package_types
                                                }
                                                disabled={
                                                  !productFormData?.product_package_types ||
                                                  isProductFormDataLoading ||
                                                  isProductFormDataError
                                                }
                                                value={values.package_type}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={
                                                  touched.package_type &&
                                                  errors.package_type
                                                }
                                                required
                                              />
                                            </div>
                                          </div>
                                          <div className="col-12">
                                            <div className="mb-3">
                                              <CustomSelect
                                                label="Beverage Taste"
                                                id="beverage_taste "
                                                name="beverage_taste"
                                                placeholder="Select Beverage Taste"
                                                className="w-100 fw-normal"
                                                labelClassName="mb-0"
                                                fullWidth
                                                options={beverageTastes}
                                                disabled={!beverageTastes}
                                                value={values.beverage_taste}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={
                                                  touched.beverage_taste &&
                                                  errors.beverage_taste
                                                }
                                                required
                                              />
                                            </div>
                                          </div>
                                          <div className="col-12">
                                            <div className="mb-3">
                                              <h3 className="secondaryTitle">
                                                Is the product you're adding a
                                                keg?
                                              </h3>
                                              <div className="d-flex align-items-center gap-3 mt-2">
                                                <CustomRadio
                                                  label="Yes"
                                                  name="is_keg"
                                                  id="is_keg_yes"
                                                  value={1}
                                                  checked={values.is_keg == '1'}
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                />
                                                <CustomRadio
                                                  label="No"
                                                  name="is_keg"
                                                  id="is_keg_no"
                                                  value={0}
                                                  checked={values.is_keg == '0'}
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          {values.is_keg == '1' && (
                                            <>
                                              <div className="col-12">
                                                <div className="mb-3">
                                                  <p className="text15 colorGrayDark fw-normal">
                                                    Select the keg Sizes{' '}
                                                    <span className="redColor">
                                                      *
                                                    </span>
                                                    :
                                                  </p>
                                                  <div className="d-flex align-items-center gap-3 mt-2">
                                                    {kegSizes.map(
                                                      (kegSize, index) => (
                                                        <CustomRadio
                                                          key={index}
                                                          label={kegSize.label}
                                                          name="keg_size"
                                                          id={kegSize.value}
                                                          value={kegSize.value}
                                                          checked={
                                                            values.keg_size ==
                                                            kegSize.value
                                                          }
                                                          onChange={
                                                            handleChange
                                                          }
                                                          onBlur={handleBlur}
                                                        />
                                                      )
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                          )}
                                          <div className="col-12">
                                            <div className="mb-3">
                                              {/* <p className="text15 colorGrayDark fw-normal">
                                        Accessories{' '}
                                        <span className="redColor">*</span>:
                                      </p>
                                      <Select
                                        isMulti
                                        name="accessories"
                                        options={accessories}
                                        //   className="mainInput"
                                        classNamePrefix="select"
                                        value={values.accessories}
                                        onChange={(selectedOptions) => {
                                          handleChange({
                                            target: {
                                              name: 'accessories',
                                              value: selectedOptions,
                                            },
                                          });
                                        }}
                                        //   onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                          touched.accessories &&
                                          errors.accessories
                                        }
                                        placeholder="Select Accessories"
                                      /> */}
                                              <CustomInput
                                                label="Accessories"
                                                id="accessories"
                                                name="accessories"
                                                type="text"
                                                placeholder="Enter Accessories"
                                                value={values.accessories}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={
                                                  touched.accessories &&
                                                  errors.accessories
                                                }
                                                required
                                              />
                                            </div>
                                          </div>
                                          {values.is_keg == '1' && (
                                            <>
                                              <div className="col-12">
                                                <div className="mb-3">
                                                  <CustomSelect
                                                    label="Keg Rental Duration"
                                                    id="keg_rental_duration "
                                                    name="keg_rental_duration"
                                                    placeholder="Select Keg Rental Duration"
                                                    className="w-100 fw-normal"
                                                    labelClassName="mb-0"
                                                    fullWidth
                                                    options={kegRentalDurations}
                                                    disabled={
                                                      !kegRentalDurations
                                                    }
                                                    value={
                                                      values.keg_rental_duration
                                                    }
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={
                                                      touched.keg_rental_duration &&
                                                      errors.keg_rental_duration
                                                    }
                                                    required
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-12">
                                                <div className="mb-3">
                                                  <CustomInput
                                                    label="Deposit"
                                                    id="deposit"
                                                    name="deposit"
                                                    type="number"
                                                    min={0}
                                                    placeholder="Enter Deposit"
                                                    value={values.deposit}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={
                                                      touched.deposit &&
                                                      errors.deposit
                                                    }
                                                    required
                                                  />
                                                </div>
                                              </div>
                                            </>
                                          )}
                                          <div className="col-12">
                                            <div className="mb-3">
                                              <CustomInput
                                                label="Price"
                                                id="price"
                                                name="price"
                                                type="number"
                                                min={0}
                                                placeholder="Enter Price"
                                                value={values.price}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={
                                                  touched.price && errors.price
                                                }
                                                required
                                              />
                                            </div>
                                          </div>
                                          <div className="col-12">
                                            <div className="mb-3">
                                              <CustomSelect
                                                label="Status"
                                                id="status "
                                                name="status"
                                                placeholder="Select Status"
                                                className="w-100 fw-normal"
                                                labelClassName="mb-0"
                                                fullWidth
                                                options={productStatus}
                                                disabled={!productStatus}
                                                value={values.status}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={
                                                  touched.status &&
                                                  errors.status
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
                                        text="Update"
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
                )}
              </>
            </CustomCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProduct;
