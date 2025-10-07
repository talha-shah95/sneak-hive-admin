import React, { useEffect, useState } from 'react';

import { Formik, Form } from 'formik';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useForm } from '../../../../Hooks/useForm';

import useModalStore from '../../../../Store/ModalStore';

import { stockAvailabilityList, statusList } from '../../../../Constants';

import AddProductService from './Services/AddProductService';
import GetActiveCategories from '../Services/GetActiveCategories';
import GetProductSubCategoryData from '../Services/GetProductSubCategoryData';
import GetBrands from '../Services/GetBrands';

import { addProductValidationSchema } from './Validations';

import Select from 'react-select';
import { showToast } from '../../../../Components/CustomToast';
import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import CustomSelect from '../../../../Components/CustomSelect';
import CustomMultiImageUploader from '../../../../Components/CustomMultiImageUploader';

const AddProduct = () => {
  const queryClient = useQueryClient();
  const { showModal, closeModal } = useModalStore();
  const navigate = useNavigate();

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  const [brandList, setBrandList] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');

  const {
    data: categoryList,
    isLoading: isCategoryListLoading,
    isError: isCategoryListError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: GetActiveCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  const {
    data: subCategoryList,
    isLoading: isSubCategoryListLoading,
    isError: isSubCategoryListError,
  } = useQuery({
    queryKey: ['subCategories', selectedCategories],
    queryFn: () => GetProductSubCategoryData(selectedCategories),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    enabled: selectedCategories.length > 0,
  });

  const {
    data: brandData,
    isLoading: isBrandDataLoading,
    isError: isBrandDataError,
  } = useQuery({
    queryKey: ['brandData'],
    queryFn: () => GetBrands({}, {}),
  });

  const { mutate: addProductMutation, isLoading } = useForm({
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
            navigate('/product-management');
          },
        },
      });
    },
    onError: (error) => {
      showToast(error?.data?.message.failed || 'Product add failed', 'error');
    },
  });

  useEffect(() => {
    if (categoryList) {
      setCategoryOptions(
        categoryList.data.map((category) => ({
          value: category.id,
          label: category.name,
        }))
      );
    }
  }, [categoryList]);

  useEffect(() => {
    if (categoryList && subCategoryList) {
      setSubCategoryOptions(
        subCategoryList.data.map((subCategory) => ({
          value: subCategory.id,
          label: subCategory.name,
        }))
      );
    }
  }, [categoryList, subCategoryList]);

  useEffect(() => {
    if (brandData) {
      const tempBrandList = brandData.data.map((brand) => {
        return {
          label: brand.name,
          value: brand.id,
        };
      });
      setBrandList(tempBrandList);
      setSelectedBrand(tempBrandList[0]?.value);
    }
  }, [brandData]);

  const handleSubmit = (values) => {
    const dataToSend = {
      ...values,
      category_ids: selectedCategories,
      sub_category_ids: selectedSubCategories,
      brand_id: selectedBrand,
    };

    const formDataToSend = new FormData();
    formDataToSend.append('name', dataToSend.name);
    formDataToSend.append('description', dataToSend.description);
    formDataToSend.append('price', dataToSend.price);
    formDataToSend.append('category_ids[]', selectedCategories);
    formDataToSend.append('sub_category_ids[]', selectedSubCategories);
    formDataToSend.append('brand_id', selectedBrand);
    formDataToSend.append('affiliate_link', dataToSend.affiliate_link);
    formDataToSend.append('availibility', dataToSend.availibility);
    formDataToSend.append('is_active', dataToSend.is_active);

    if (selectedCategories && selectedCategories.length > 0) {
      selectedCategories.forEach((id, index) => {
        formDataToSend.append(`category_ids[${index}]`, id);
      });
    }
    if (selectedSubCategories && selectedSubCategories.length > 0) {
      selectedSubCategories.forEach((id, index) => {
        formDataToSend.append(`sub_category_ids[${index}]`, id);
      });
    }
    if (values.images && values.images.length > 0) {
      values.images.forEach((file, index) => {
        if (file instanceof File) {
          formDataToSend.append(`images[${index}]`, file);
        }
      });
    }
    showModal({
      type: 'question',
      modalProps: {
        title: 'Add Product?',
        message: 'Are you sure you want to add the Product?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          addProductMutation({
            service: AddProductService,
            data: formDataToSend,
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
              title="Add Product"
              backButton={true}
              backLink={'/product-management'}
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
                    description: '',
                    price: '',
                    category_ids: [],
                    sub_category_ids: [],
                    brand_id: '',
                    affiliate_link: '',
                    availibility: 'in_stock',
                    is_active: 1,
                    image: '',
                  }}
                  validationSchema={addProductValidationSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize={true}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    setFieldValue,
                    setFieldTouched,
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
                                    label="Product Name"
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter Product Name"
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
                                      touched.description && errors.description
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <CustomInput
                                    label="Price"
                                    id="price"
                                    name="price"
                                    type="number"
                                    placeholder="Enter Price"
                                    value={values.price}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.price && errors.price}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <div className="inputWraper">
                                    <label>
                                      Categories
                                      <span className="text-danger">*</span>
                                    </label>
                                    <Select
                                      isMulti
                                      name="category_ids"
                                      options={categoryOptions}
                                      classNamePrefix="react-select mainInput"
                                      value={categoryOptions.filter((option) =>
                                        values.category_ids.includes(
                                          option.value
                                        )
                                      )}
                                      isLoading={isCategoryListLoading}
                                      isDisabled={
                                        isCategoryListLoading ||
                                        isCategoryListError
                                      }
                                      placeholder={
                                        isCategoryListLoading
                                          ? 'Loading categories...'
                                          : 'Select Categories'
                                      }
                                      onChange={(selectedOptions) => {
                                        const ids =
                                          selectedOptions?.map(
                                            (option) => option.value
                                          ) || [];
                                        setSelectedCategories(ids);
                                        setFieldValue('category_ids', ids);
                                      }}
                                      onBlur={() =>
                                        setFieldTouched('category_ids', true)
                                      }
                                    />
                                    {touched.category_ids &&
                                      errors.category_ids && (
                                        <div className="text-danger small mt-1">
                                          {errors.category_ids}
                                        </div>
                                      )}
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <div className="inputWraper">
                                    <label>
                                      Sub Categories
                                      <span className="text-danger">*</span>
                                    </label>
                                    <Select
                                      isMulti
                                      name="sub_category_ids"
                                      options={subCategoryOptions}
                                      classNamePrefix="react-select mainInput"
                                      value={subCategoryOptions.filter(
                                        (option) =>
                                          values.sub_category_ids.includes(
                                            option.value
                                          )
                                      )}
                                      isLoading={isSubCategoryListLoading}
                                      isDisabled={
                                        isSubCategoryListLoading ||
                                        isSubCategoryListError
                                      }
                                      placeholder={
                                        isSubCategoryListLoading
                                          ? 'Loading Sub Categories...'
                                          : 'Select Sub Categories'
                                      }
                                      onChange={(selectedOptions) => {
                                        const ids =
                                          selectedOptions?.map(
                                            (option) => option.value
                                          ) || [];
                                        setSelectedSubCategories(ids);
                                        setFieldValue('sub_category_ids', ids);
                                      }}
                                      onBlur={() =>
                                        setFieldTouched(
                                          'sub_category_ids',
                                          true
                                        )
                                      }
                                    />
                                    {touched.sub_category_ids &&
                                      errors.sub_category_ids && (
                                        <div className="text-danger small mt-1">
                                          {errors.sub_category_ids}
                                        </div>
                                      )}
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <CustomSelect
                                    label="Brand Name"
                                    id="brand_id "
                                    name="brand_id"
                                    placeholder="Select Brand"
                                    className="w-100 fw-normal"
                                    labelClassName="mb-0"
                                    fullWidth
                                    options={brandList || []}
                                    disabled={
                                      !brandList ||
                                      isBrandDataLoading ||
                                      isBrandDataError
                                    }
                                    value={
                                      values.brand_id ||
                                      selectedBrand ||
                                      brandList[0]?.value
                                    }
                                    onChange={(e) => {
                                      setSelectedBrand(e.target.value);
                                      handleChange(e);
                                    }}
                                    onBlur={handleBlur}
                                    error={touched.brand_id && errors.brand_id}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <CustomInput
                                    label="Product Affiliate Link"
                                    id="affiliate_link"
                                    name="affiliate_link"
                                    type="url"
                                    placeholder="Enter Product Affiliate Link"
                                    value={values.affiliate_link}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      touched.affiliate_link &&
                                      errors.affiliate_link
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
                                        label="Product Availability"
                                        id="availibility "
                                        name="availibility"
                                        placeholder="Select Product Availability"
                                    className="w-100 fw-normal"
                                    labelClassName="mb-0"
                                    fullWidth
                                        options={stockAvailabilityList}
                                        disabled={!stockAvailabilityList}
                                        value={values.availibility}
                                    onChange={(e) => {
                                      handleChange(e);
                                    }}
                                    onBlur={handleBlur}
                                        error={
                                          touched.availibility &&
                                          errors.availibility
                                        }
                                    required
                                  />
                                </div>
                                  </div>
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
                                  <CustomMultiImageUploader
                                    maxImages={12}
                                    label="Product Images"
                                    required
                                    id="images"
                                    name="images"
                                    placeholder="Upload Product Images"
                                    onChange={(e) => {
                                      handleChange({
                                        target: {
                                          name: 'images',
                                          value: e,
                                        },
                                      });
                                    }}
                                    onBlur={handleBlur}
                                    value={values.images}
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
                                text="Add Product"
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

export default AddProduct;
