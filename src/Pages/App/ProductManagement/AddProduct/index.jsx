import React, { useEffect, useState } from 'react';

import { Formik, Form } from 'formik';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

import { useForm } from '../../../../Hooks/useForm';

import useModalStore from '../../../../Store/ModalStore';

import { statusList } from '../../../../Constants';
import { weightRatingList, sizingRatingList, widthRatingList } from '../Constants';

import AddProductService from './Services/AddProductService';
import GetActiveCategories from '../Services/GetActiveCategories';
import GetProductSubCategoryData from '../Services/GetProductSubCategoryData';
import GetProductTertiaryCategoryData from '../Services/GetProductTertiaryCategoryData';
import GetBrands from '../Services/GetBrands';

import { addProductValidationSchema } from './Validations';

import { showToast } from '../../../../Components/CustomToast';
import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import CustomSelect from '../../../../Components/CustomSelect';
import CustomMultiImageUploader from '../../../../Components/CustomMultiImageUploader';

import { LuPlusCircle, LuTrash2 } from 'react-icons/lu';

import '../style.css';

const AddProduct = () => {
  const queryClient = useQueryClient();
  const { showModal, closeModal } = useModalStore();
  const navigate = useNavigate();

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  const [tertiaryCategoryOptions, setTertiaryCategoryOptions] = useState([]);
  const [selectedTertiaryCategories, setSelectedTertiaryCategories] = useState([]);

  const [brandList, setBrandList] = useState([]);

  const [signatureShoeType, setSignatureShoeType] = useState('No');

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
    data: tertiaryCategoryList,
    isLoading: isTertiaryCategoryListLoading,
    isError: isTertiaryCategoryListError,
  } = useQuery({
    queryKey: ['tertiaryCategories', selectedSubCategories],
    queryFn: () => GetProductTertiaryCategoryData(selectedSubCategories),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    enabled: selectedSubCategories.length > 0,
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
            queryClient.invalidateQueries({ queryKey: ['categories'] });
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
    if (tertiaryCategoryList) {
      setTertiaryCategoryOptions(
        tertiaryCategoryList.data.map((tertiaryCategory) => ({
          value: tertiaryCategory.id,
          label: tertiaryCategory.name,
        }))
      );
    }
  }, [tertiaryCategoryList]);

  useEffect(() => {
    if (brandData) {
      const tempBrandList = brandData.data.map((brand) => {
        return {
          label: brand.name,
          value: brand.id,
        };
      });
      setBrandList(tempBrandList);
    }
  }, [brandData]);

  // Helper functions for managing repeaters
  const addBrandEntry = (setFieldValue, values) => {
    const newBrands = [
      ...values.brands,
      {
        brand_id: '',
        price: '',
        affiliate_link: '',
      }
    ];
    setFieldValue('brands', newBrands);
  };

  const removeBrandEntry = (setFieldValue, values, index) => {
    const newBrands = values.brands.filter((_, i) => i !== index);
    setFieldValue('brands', newBrands);
  };

  const addDetailEntry = (setFieldValue, values) => {
    const newDetails = [
      ...values.details,
      {
        weight: '',
        sizing: '',
        width: '',
      }
    ];
    setFieldValue('details', newDetails);
  };

  const removeDetailEntry = (setFieldValue, values, index) => {
    const newDetails = values.details.filter((_, i) => i !== index);
    setFieldValue('details', newDetails);
  };

  const addReviewEntry = (setFieldValue, values) => {
    const newReviews = [
      ...values.reviews,
      {
        rating: '',
        rating_status: '',
        review: '',
        traction: '',
        traction_detail: '',
        cushion: '',
        cushion_detail: '',
        material: '',
        material_detail: '',
        support: '',
        support_detail: '',
        fit: '',
        fit_detail: '',
        outdoor: '',
        outdoor_detail: '',
        width: '',
        width_detail: '',
        size: '',
        size_detail: '',
      }
    ];
    setFieldValue('reviews', newReviews);
  };

  const removeReviewEntry = (setFieldValue, values, index) => {
    const newReviews = values.reviews.filter((_, i) => i !== index);
    setFieldValue('reviews', newReviews);
  };

  const addProsEntry = (setFieldValue, values) => {
    setFieldValue('pros', [...values.pros, '']);
  };

  const removeProsEntry = (setFieldValue, values, index) => {
    const newPros = values.pros.filter((_, i) => i !== index);
    setFieldValue('pros', newPros);
  };

  const addConsEntry = (setFieldValue, values) => {
    setFieldValue('cons', [...values.cons, '']);
  };

  const removeConsEntry = (setFieldValue, values, index) => {
    const newCons = values.cons.filter((_, i) => i !== index);
    setFieldValue('cons', newCons);
  };

  const handleSubmit = (values) => {
    console.log(values, 'values');

    const formDataToSend = new FormData();

    // Basic fields
    formDataToSend.append('name', values.name);
    formDataToSend.append('description', values.description);
    formDataToSend.append('suitable_for', values.suitable_for || '');
    formDataToSend.append('signature_shoe', values.signature_shoe || '');
    formDataToSend.append('style', values.style || '');
    formDataToSend.append('availibility', values.availibility);
    formDataToSend.append('is_active', values.is_active);

    // Category arrays
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
    if (selectedTertiaryCategories && selectedTertiaryCategories.length > 0) {
      selectedTertiaryCategories.forEach((id, index) => {
        formDataToSend.append(`tertiary_category_ids[${index}]`, id);
      });
    }

    // Brands array
    if (values.brands && values.brands.length > 0) {
      values.brands.forEach((brand, index) => {
        if (brand.brand_id) {
          formDataToSend.append(`brands[${index}][brand_id]`, brand.brand_id);
        }
        if (brand.price) {
          formDataToSend.append(`brands[${index}][price]`, brand.price);
        }
        if (brand.affiliate_link) {
          formDataToSend.append(`brands[${index}][affiliate_link]`, brand.affiliate_link);
        }
      });
    }

    // Details array
    if (values.details && values.details.length > 0) {
      values.details.forEach((detail, index) => {
        if (detail.weight) {
          formDataToSend.append(`details[${index}][weight]`, detail.weight);
        }
        if (detail.sizing) {
          formDataToSend.append(`details[${index}][sizing]`, detail.sizing);
        }
        if (detail.width) {
          formDataToSend.append(`details[${index}][width]`, detail.width);
        }
      });
    }

    // Reviews array
    if (values.reviews && values.reviews.length > 0) {
      values.reviews.forEach((review, index) => {
        if (review.rating) {
          formDataToSend.append(`reviews[${index}][rating]`, review.rating);
        }
        if (review.rating_status) {
          formDataToSend.append(`reviews[${index}][rating_status]`, review.rating_status);
        }
        if (review.review) {
          formDataToSend.append(`reviews[${index}][review]`, review.review);
        }
        if (review.traction) {
          formDataToSend.append(`reviews[${index}][traction]`, review.traction);
        }
        if (review.traction_detail) {
          formDataToSend.append(`reviews[${index}][traction_detail]`, review.traction_detail);
        }
        if (review.cushion) {
          formDataToSend.append(`reviews[${index}][cushion]`, review.cushion);
        }
        if (review.cushion_detail) {
          formDataToSend.append(`reviews[${index}][cushion_detail]`, review.cushion_detail);
        }
        if (review.material) {
          formDataToSend.append(`reviews[${index}][material]`, review.material);
        }
        if (review.material_detail) {
          formDataToSend.append(`reviews[${index}][material_detail]`, review.material_detail);
        }
        if (review.support) {
          formDataToSend.append(`reviews[${index}][support]`, review.support);
        }
        if (review.support_detail) {
          formDataToSend.append(`reviews[${index}][support_detail]`, review.support_detail);
        }
        if (review.fit) {
          formDataToSend.append(`reviews[${index}][fit]`, review.fit);
        }
        if (review.fit_detail) {
          formDataToSend.append(`reviews[${index}][fit_detail]`, review.fit_detail);
        }
        if (review.outdoor) {
          formDataToSend.append(`reviews[${index}][outdoor]`, review.outdoor);
        }
        if (review.outdoor_detail) {
          formDataToSend.append(`reviews[${index}][outdoor_detail]`, review.outdoor_detail);
        }
        if (review.width) {
          formDataToSend.append(`reviews[${index}][width]`, review.width);
        }
        if (review.width_detail) {
          formDataToSend.append(`reviews[${index}][width_detail]`, review.width_detail);
        }
        if (review.size) {
          formDataToSend.append(`reviews[${index}][size]`, review.size);
        }
        if (review.size_detail) {
          formDataToSend.append(`reviews[${index}][size_detail]`, review.size_detail);
        }
      });
    }

    // Pros array
    if (values.pros && values.pros.length > 0) {
      values.pros.forEach((pro) => {
        if (pro && pro.trim()) {
          formDataToSend.append('pros[]', pro);
        }
      });
    }

    // Cons array
    if (values.cons && values.cons.length > 0) {
      values.cons.forEach((con) => {
        if (con && con.trim()) {
          formDataToSend.append('cons[]', con);
        }
      });
    }

    // Images
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
                    suitable_for: '',
                    signature_shoe: 'No',
                    style: '',
                    category_ids: [],
                    sub_category_ids: [],
                    tertiary_category_ids: [],
                    availibility: 'in_stock',
                    is_active: 1,
                    images: '',
                    brands: [
                      {
                        brand_id: '',
                        price: '',
                        affiliate_link: '',
                      }
                    ],
                    details: [
                      {
                        weight: '',
                        sizing: '',
                        width: '',
                      }
                    ],
                    reviews: [
                      {
                        rating: '',
                        rating_status: '',
                        review: '',
                        traction: '',
                        traction_detail: '',
                        cushion: '',
                        cushion_detail: '',
                        material: '',
                        material_detail: '',
                        support: '',
                        support_detail: '',
                        fit: '',
                        fit_detail: '',
                        outdoor: '',
                        outdoor_detail: '',
                        width: '',
                        width_detail: '',
                        size: '',
                        size_detail: '',
                      }
                    ],
                    pros: [''],
                    cons: [''],
                  }}
                  validationSchema={addProductValidationSchema}
                  onSubmit={handleSubmit}
                // enableReinitialize={true}
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
                              {/* Product Name */}
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
                              {/* Product Description */}
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
                              {/* Best Suitable For */}
                              <div className="col-12">
                                <div className="mb-3">
                                  <CustomInput
                                    label="Best Suitable For"
                                    id="suitable_for"
                                    name="suitable_for"
                                    type="textarea"
                                    placeholder="Enter Best Suitable For"
                                    rows={4}
                                    value={values.suitable_for}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      touched.suitable_for && errors.suitable_for
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              {/* Categories */}
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
                              {/* Sub Categories */}
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
                                        !selectedCategories ||
                                        selectedCategories.length == 0 ||
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
                                            (option) => option?.value
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
                              {/* Tertiary Categories */}
                              <div className="col-12">
                                <div className="mb-3">
                                  <div className="inputWraper">
                                    <label>
                                      Tertiary Categories
                                      <span className="text-danger">*</span>
                                    </label>
                                    <Select
                                      isMulti
                                      name="tertiary_category_ids"
                                      options={tertiaryCategoryOptions}
                                      classNamePrefix="react-select mainInput"
                                      value={tertiaryCategoryOptions.filter(
                                        (option) => option?.value &&
                                          (values.tertiary_category_ids || []).includes(
                                            option?.value
                                          )
                                      )}
                                      isLoading={isTertiaryCategoryListLoading}
                                      isDisabled={
                                        isTertiaryCategoryListLoading ||
                                        isTertiaryCategoryListError ||
                                        isSubCategoryListLoading ||
                                        isSubCategoryListError ||
                                        !selectedSubCategories ||
                                        selectedSubCategories.length == 0
                                      }
                                      placeholder={
                                        isTertiaryCategoryListLoading
                                          ? 'Loading Tertiary Categories...'
                                          : 'Select Tertiary Categories'
                                      }
                                      onChange={(selectedOptions) => {
                                        const ids =
                                          selectedOptions?.map(
                                            (option) => option?.value
                                          ) || [];
                                        setSelectedTertiaryCategories(ids);
                                        setFieldValue('tertiary_category_ids', ids);
                                      }}
                                      onBlur={() =>
                                        setFieldTouched(
                                          'tertiary_category_ids',
                                          true
                                        )
                                      }
                                    />
                                    {touched.tertiary_category_ids &&
                                      errors.tertiary_category_ids && (
                                        <div className="text-danger small mt-1">
                                          {errors.tertiary_category_ids}
                                        </div>
                                      )}
                                  </div>
                                </div>
                              </div>
                              {/* Brands */}
                              <div className="col-12">
                                <div className="mb-3">
                                  <div className="row attributeBoxWrapper mb-3">
                                    <div className="col-12">
                                      <h5 className="mb-3">
                                        Brands <span className="text-danger">*</span>
                                      </h5>
                                      {values.brands.map((brand, index) => (
                                        <div key={index} className="row attributeBox">
                                          <div className="col-12">
                                            <div className="mb-3">
                                              <CustomSelect
                                                label="Select Brand"
                                                id={`brands[${index}][brand_id]`}
                                                name={`brands[${index}][brand_id]`}
                                                placeholder="Select Brand"
                                                className="w-100 fw-normal"
                                                labelClassName="mb-0"
                                                fullWidth
                                                options={brandList || []}
                                                disabled={!brandList || isBrandDataLoading || isBrandDataError}
                                                value={brand.brand_id || brandList[0]?.value}
                                                onChange={(e) => {
                                                  const newBrands = [...values.brands];
                                                  newBrands[index].brand_id = e.target.value;
                                                  setFieldValue('brands', newBrands);
                                                }}
                                                onBlur={handleBlur}
                                                error={touched.brands?.[index]?.brand_id && errors.brands?.[index]?.brand_id}
                                                required
                                              />
                                            </div>
                                          </div>
                                          <div className="col-12">
                                            <div className="mb-3">
                                              <CustomInput
                                                label="Price"
                                                id={`brands[${index}][price]`}
                                                name={`brands[${index}][price]`}
                                                type="number"
                                                placeholder="Enter Price"
                                                value={brand.price}
                                                onChange={(e) => {
                                                  const newBrands = [...values.brands];
                                                  newBrands[index].price = e.target.value;
                                                  setFieldValue('brands', newBrands);
                                                }}
                                                onBlur={handleBlur}
                                                error={touched.brands?.[index]?.price && errors.brands?.[index]?.price}
                                                required
                                              />
                                            </div>
                                          </div>
                                          <div className="col-12">
                                            <div className="mb-3">
                                              <CustomInput
                                                label="Product Affiliate Link"
                                                id={`brands[${index}][affiliate_link]`}
                                                name={`brands[${index}][affiliate_link]`}
                                                type="url"
                                                placeholder="Enter Product Affiliate Link"
                                                value={brand.affiliate_link}
                                                onChange={(e) => {
                                                  const newBrands = [...values.brands];
                                                  newBrands[index].affiliate_link = e.target.value;
                                                  setFieldValue('brands', newBrands);
                                                }}
                                                onBlur={handleBlur}
                                                error={touched.brands?.[index]?.affiliate_link && errors.brands?.[index]?.affiliate_link}
                                                required
                                              />
                                            </div>
                                          </div>
                                          {values.brands.length > 1 && (
                                            <div className="col-12 text-end">
                                              <button
                                                type="button"
                                                className="notButton colorRed"
                                                onClick={() => removeBrandEntry(setFieldValue, values, index)}
                                              >
                                                <div className="d-flex align-items-center justify-content-center gap-1">
                                                  <span>Remove</span>
                                                  <LuTrash2 size={16} />
                                                </div>
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="row attributeRepeaterWrapper">
                                    <div className="col-12 text-end">
                                      <button
                                        type="button"
                                        className="notButton"
                                        onClick={() => addBrandEntry(setFieldValue, values)}
                                      >
                                        <div className="d-flex align-items-center justify-content-center gap-1">
                                          <span>Add More</span>
                                          <LuPlusCircle size={18} />
                                        </div>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Weight and Sizing */}
                              <div className="col-12">
                                <div className="row attributeBoxWrapper mb-3">
                                  <div className="col-12">
                                    <h5 className="mb-3">
                                      Weight and Sizing <span className="text-danger">*</span>
                                    </h5>
                                    {values.details.map((detail, index) => (
                                      <div key={index} className="row attributeBox">
                                        <div className="col-12">
                                          <div className="mb-3">
                                            <CustomSelect
                                              label="Weight"
                                              id={`details[${index}][weight_rating]`}
                                              name={`details[${index}][weight_rating]`}
                                              placeholder="Select Weight"
                                              className="w-100 fw-normal"
                                              labelClassName="mb-0"
                                              fullWidth
                                              options={weightRatingList || []}
                                              disabled={!weightRatingList || weightRatingList.length == 0}
                                              value={detail.weight}
                                              onChange={(e) => {
                                                const newDetails = [...values.details];
                                                newDetails[index].weight = e.target.value;
                                                setFieldValue('details', newDetails);
                                              }}
                                              onBlur={handleBlur}
                                              error={touched.details?.[index]?.weight && errors.details?.[index]?.weight}
                                              required
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="mb-3">
                                            <CustomSelect
                                              label="Sizing"
                                              id={`details[${index}][sizing]`}
                                              name={`details[${index}][sizing]`}
                                              placeholder="Select Sizing"
                                              className="w-100 fw-normal"
                                              labelClassName="mb-0"
                                              fullWidth
                                              options={sizingRatingList || []}
                                              disabled={!sizingRatingList || sizingRatingList.length == 0}
                                              value={detail.sizing}
                                              onChange={(e) => {
                                                const newDetails = [...values.details];
                                                newDetails[index].sizing = e.target.value;
                                                setFieldValue('details', newDetails);
                                              }}
                                              onBlur={handleBlur}
                                              error={touched.details?.[index]?.sizing && errors.details?.[index]?.sizing}
                                              required
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="mb-3">
                                            <CustomSelect
                                              label="Width"
                                              id={`details[${index}][width]`}
                                              name={`details[${index}][width]`}
                                              placeholder="Select Width"
                                              className="w-100 fw-normal"
                                              labelClassName="mb-0"
                                              fullWidth
                                              options={widthRatingList || []}
                                              disabled={!widthRatingList || widthRatingList.length == 0}
                                              value={detail.width}
                                              onChange={(e) => {
                                                const newDetails = [...values.details];
                                                newDetails[index].width = e.target.value;
                                                setFieldValue('details', newDetails);
                                              }}
                                              onBlur={handleBlur}
                                              error={touched.details?.[index]?.width && errors.details?.[index]?.width}
                                              required
                                            />
                                          </div>
                                        </div>
                                        {values.details.length > 1 && (
                                          <div className="col-12 text-end">
                                            <button
                                              type="button"
                                              className="notButton colorRed"
                                              onClick={() => removeDetailEntry(setFieldValue, values, index)}
                                            >
                                              <div className="d-flex align-items-center justify-content-center gap-1">
                                                <span>Remove</span>
                                                <LuTrash2 size={16} />
                                              </div>
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="row attributeRepeaterWrapper">
                                  <div className="col-12 text-end">
                                    <button
                                      type="button"
                                      className="notButton"
                                      onClick={() => addDetailEntry(setFieldValue, values)}
                                    >
                                      <div className="d-flex align-items-center justify-content-center gap-1">
                                        <span>Add More</span>
                                        <LuPlusCircle size={18} />
                                      </div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                              {/* Signature Shoe */}
                              <div className="col-12">
                                <div className="mb-3">
                                  <CustomSelect
                                    label="Signature Shoe"
                                    id="signature_shoe"
                                    name="signature_shoe"
                                    placeholder="Select Signature Shoe"
                                    className="w-100 fw-normal"
                                    labelClassName="mb-0"
                                    fullWidth
                                    options={[{ value: 'no', label: 'No' }, { value: 'other', label: 'Other' }]}
                                    value={signatureShoeType}
                                    onChange={(e) => {
                                      if (e.target.value == 'no') {
                                        setFieldValue('signature_shoe', e.target.value);
                                        setSignatureShoeType(e.target.value);
                                      }
                                      else {
                                        setSignatureShoeType(e.target.value);
                                      }
                                    }}
                                    onBlur={handleBlur}
                                    required
                                  />
                                </div>
                                {signatureShoeType === 'other' && (
                                  <div className="mb-3">
                                    <CustomInput
                                      label="Other Value"
                                      id="signature_shoe"
                                      name="signature_shoe"
                                      type="text"
                                      placeholder="Enter Other Value"
                                      value={values.signature_shoe}
                                      onChange={(e) => {
                                        setFieldValue('signature_shoe', e.target.value);
                                      }}
                                      onBlur={handleBlur}
                                      error={touched.signature_shoe && errors.signature_shoe}
                                      required
                                    />
                                  </div>
                                )}
                              </div>
                              {/* Style */}
                              <div className="col-12">
                                <div className="mb-3">
                                  <CustomInput
                                    label="Style"
                                    id="style"
                                    name="style"
                                    type="text"
                                    placeholder="Enter Style"
                                    value={values.style}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.style && errors.style}
                                    required
                                  />
                                </div>
                              </div>
                              {/* Expert Review */}
                              <div className="col-12">
                                <div className="mb-3">
                                  <label className="mb-2">
                                    Expert Review <span className="text-danger">*</span>
                                  </label>
                                  {values.reviews.map((review, index) => (
                                    <div key={index} className="attributeBoxWrapper mb-3">
                                      <div className="row attributeBox">
                                        <div className="col-12">
                                          <div className="mb-3">
                                            <CustomInput
                                              label="Rating"
                                              id={`reviews[${index}][rating]`}
                                              name={`reviews[${index}][rating]`}
                                              type="text"
                                              placeholder="Enter Rating"
                                              value={review.rating}
                                              onChange={(e) => {
                                                const newReviews = [...values.reviews];
                                                newReviews[index].rating = e.target.value;
                                                setFieldValue('reviews', newReviews);
                                              }}
                                              onBlur={handleBlur}
                                              error={touched.reviews?.[index]?.rating && errors.reviews?.[index]?.rating}
                                              required
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="mb-3">
                                            <CustomInput
                                              label="Rating Status"
                                              id={`reviews[${index}][rating_status]`}
                                              name={`reviews[${index}][rating_status]`}
                                              type="text"
                                              placeholder="Enter Rating Status"
                                              value={review.rating_status}
                                              onChange={(e) => {
                                                const newReviews = [...values.reviews];
                                                newReviews[index].rating_status = e.target.value;
                                                setFieldValue('reviews', newReviews);
                                              }}
                                              onBlur={handleBlur}
                                              error={touched.reviews?.[index]?.rating_status && errors.reviews?.[index]?.rating_status}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="mb-3">
                                            <CustomInput
                                              label="Overall Review"
                                              id={`reviews[${index}][review]`}
                                              name={`reviews[${index}][review]`}
                                              type="textarea"
                                              placeholder="Enter Overall Review"
                                              rows={4}
                                              value={review.review}
                                              onChange={(e) => {
                                                const newReviews = [...values.reviews];
                                                newReviews[index].review = e.target.value;
                                                setFieldValue('reviews', newReviews);
                                              }}
                                              onBlur={handleBlur}
                                              error={touched.reviews?.[index]?.review && errors.reviews?.[index]?.review}
                                              required
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="mb-3">
                                            <CustomInput
                                              label="Traction"
                                              id={`reviews[${index}][traction]`}
                                              name={`reviews[${index}][traction]`}
                                              type="text"
                                              placeholder="Enter Traction"
                                              value={review.traction}
                                              onChange={(e) => {
                                                const newReviews = [...values.reviews];
                                                newReviews[index].traction = e.target.value;
                                                setFieldValue('reviews', newReviews);
                                              }}
                                              onBlur={handleBlur}
                                              error={touched.reviews?.[index]?.traction && errors.reviews?.[index]?.traction}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="mb-3">
                                            <CustomInput
                                              label="Traction Detail"
                                              id={`reviews[${index}][traction_detail]`}
                                              name={`reviews[${index}][traction_detail]`}
                                              type="text"
                                              placeholder="Enter Traction Detail"
                                              value={review.traction_detail}
                                              onChange={(e) => {
                                                const newReviews = [...values.reviews];
                                                newReviews[index].traction_detail = e.target.value;
                                                setFieldValue('reviews', newReviews);
                                              }}
                                              onBlur={handleBlur}
                                              error={touched.reviews?.[index]?.traction_detail && errors.reviews?.[index]?.traction_detail}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="mb-3">
                                            <CustomInput
                                              label="Cushion"
                                              id={`reviews[${index}][cushion]`}
                                              name={`reviews[${index}][cushion]`}
                                              type="text"
                                              placeholder="Enter Cushion"
                                              value={review.cushion}
                                              onChange={(e) => {
                                                const newReviews = [...values.reviews];
                                                newReviews[index].cushion = e.target.value;
                                                setFieldValue('reviews', newReviews);
                                              }}
                                              onBlur={handleBlur}
                                              error={touched.reviews?.[index]?.cushion && errors.reviews?.[index]?.cushion}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="mb-3">
                                            <CustomInput
                                              label="Cushion Detail"
                                              id={`reviews[${index}][cushion_detail]`}
                                              name={`reviews[${index}][cushion_detail]`}
                                              type="text"
                                              placeholder="Enter Cushion Detail"
                                              value={review.cushion_detail}
                                              onChange={(e) => {
                                                const newReviews = [...values.reviews];
                                                newReviews[index].cushion_detail = e.target.value;
                                                setFieldValue('reviews', newReviews);
                                              }}
                                              onBlur={handleBlur}
                                              error={touched.reviews?.[index]?.cushion_detail && errors.reviews?.[index]?.cushion_detail}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="mb-3">
                                            <CustomInput
                                              label="Material"
                                              id={`reviews[${index}][material]`}
                                              name={`reviews[${index}][material]`}
                                              type="text"
                                              placeholder="Enter Material"
                                              value={review.material}
                                              onChange={(e) => {
                                                const newReviews = [...values.reviews];
                                                newReviews[index].material = e.target.value;
                                                setFieldValue('reviews', newReviews);
                                              }}
                                              onBlur={handleBlur}
                                              error={touched.reviews?.[index]?.material && errors.reviews?.[index]?.material}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="mb-3">
                                            <CustomInput
                                              label="Material Detail"
                                              id={`reviews[${index}][material_detail]`}
                                              name={`reviews[${index}][material_detail]`}
                                              type="text"
                                              placeholder="Enter Material Detail"
                                              value={review.material_detail}
                                              onChange={(e) => {
                                                const newReviews = [...values.reviews];
                                                newReviews[index].material_detail = e.target.value;
                                                setFieldValue('reviews', newReviews);
                                              }}
                                              onBlur={handleBlur}
                                              error={touched.reviews?.[index]?.material_detail && errors.reviews?.[index]?.material_detail}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="mb-3">
                                            <CustomInput
                                              label="Support"
                                              id={`reviews[${index}][support]`}
                                              name={`reviews[${index}][support]`}
                                              type="text"
                                              placeholder="Enter Support"
                                              value={review.support}
                                              onChange={(e) => {
                                                const newReviews = [...values.reviews];
                                                newReviews[index].support = e.target.value;
                                                setFieldValue('reviews', newReviews);
                                              }}
                                              onBlur={handleBlur}
                                              error={touched.reviews?.[index]?.support && errors.reviews?.[index]?.support}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="mb-3">
                                            <CustomInput
                                              label="Support Detail"
                                              id={`reviews[${index}][support_detail]`}
                                              name={`reviews[${index}][support_detail]`}
                                              type="text"
                                              placeholder="Enter Support Detail"
                                              value={review.support_detail}
                                              onChange={(e) => {
                                                const newReviews = [...values.reviews];
                                                newReviews[index].support_detail = e.target.value;
                                                setFieldValue('reviews', newReviews);
                                              }}
                                              onBlur={handleBlur}
                                              error={touched.reviews?.[index]?.support_detail && errors.reviews?.[index]?.support_detail}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="mb-3">
                                            <CustomInput
                                              label="Fit"
                                              id={`reviews[${index}][fit]`}
                                              name={`reviews[${index}][fit]`}
                                              type="text"
                                              placeholder="Enter Fit"
                                              value={review.fit}
                                              onChange={(e) => {
                                                const newReviews = [...values.reviews];
                                                newReviews[index].fit = e.target.value;
                                                setFieldValue('reviews', newReviews);
                                              }}
                                              onBlur={handleBlur}
                                              error={touched.reviews?.[index]?.fit && errors.reviews?.[index]?.fit}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="mb-3">
                                            <CustomInput
                                              label="Fit Detail"
                                              id={`reviews[${index}][fit_detail]`}
                                              name={`reviews[${index}][fit_detail]`}
                                              type="text"
                                              placeholder="Enter Fit Detail"
                                              value={review.fit_detail}
                                              onChange={(e) => {
                                                const newReviews = [...values.reviews];
                                                newReviews[index].fit_detail = e.target.value;
                                                setFieldValue('reviews', newReviews);
                                              }}
                                              onBlur={handleBlur}
                                              error={touched.reviews?.[index]?.fit_detail && errors.reviews?.[index]?.fit_detail}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="mb-3">
                                            <CustomInput
                                              label="Outdoor"
                                              id={`reviews[${index}][outdoor]`}
                                              name={`reviews[${index}][outdoor]`}
                                              type="text"
                                              placeholder="Enter Outdoor"
                                              value={review.outdoor}
                                              onChange={(e) => {
                                                const newReviews = [...values.reviews];
                                                newReviews[index].outdoor = e.target.value;
                                                setFieldValue('reviews', newReviews);
                                              }}
                                              onBlur={handleBlur}
                                              error={touched.reviews?.[index]?.outdoor && errors.reviews?.[index]?.outdoor}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="mb-3">
                                            <CustomInput
                                              label="Outdoor Detail"
                                              id={`reviews[${index}][outdoor_detail]`}
                                              name={`reviews[${index}][outdoor_detail]`}
                                              type="text"
                                              placeholder="Enter Outdoor Detail"
                                              value={review.outdoor_detail}
                                              onChange={(e) => {
                                                const newReviews = [...values.reviews];
                                                newReviews[index].outdoor_detail = e.target.value;
                                                setFieldValue('reviews', newReviews);
                                              }}
                                              onBlur={handleBlur}
                                              error={touched.reviews?.[index]?.outdoor_detail && errors.reviews?.[index]?.outdoor_detail}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="mb-3">
                                            <CustomInput
                                              label="Width"
                                              id={`reviews[${index}][width]`}
                                              name={`reviews[${index}][width]`}
                                              type="text"
                                              placeholder="Enter Width"
                                              value={review.width}
                                              onChange={(e) => {
                                                const newReviews = [...values.reviews];
                                                newReviews[index].width = e.target.value;
                                                setFieldValue('reviews', newReviews);
                                              }}
                                              onBlur={handleBlur}
                                              error={touched.reviews?.[index]?.width && errors.reviews?.[index]?.width}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="mb-3">
                                            <CustomInput
                                              label="Width Detail"
                                              id={`reviews[${index}][width_detail]`}
                                              name={`reviews[${index}][width_detail]`}
                                              type="text"
                                              placeholder="Enter Width Detail"
                                              value={review.width_detail}
                                              onChange={(e) => {
                                                const newReviews = [...values.reviews];
                                                newReviews[index].width_detail = e.target.value;
                                                setFieldValue('reviews', newReviews);
                                              }}
                                              onBlur={handleBlur}
                                              error={touched.reviews?.[index]?.width_detail && errors.reviews?.[index]?.width_detail}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="mb-3">
                                            <CustomInput
                                              label="Size"
                                              id={`reviews[${index}][size]`}
                                              name={`reviews[${index}][size]`}
                                              type="text"
                                              placeholder="Enter Size"
                                              value={review.size}
                                              onChange={(e) => {
                                                const newReviews = [...values.reviews];
                                                newReviews[index].size = e.target.value;
                                                setFieldValue('reviews', newReviews);
                                              }}
                                              onBlur={handleBlur}
                                              error={touched.reviews?.[index]?.size && errors.reviews?.[index]?.size}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="mb-3">
                                            <CustomInput
                                              label="Size Detail"
                                              id={`reviews[${index}][size_detail]`}
                                              name={`reviews[${index}][size_detail]`}
                                              type="text"
                                              placeholder="Enter Size Detail"
                                              value={review.size_detail}
                                              onChange={(e) => {
                                                const newReviews = [...values.reviews];
                                                newReviews[index].size_detail = e.target.value;
                                                setFieldValue('reviews', newReviews);
                                              }}
                                              onBlur={handleBlur}
                                              error={touched.reviews?.[index]?.size_detail && errors.reviews?.[index]?.size_detail}
                                            />
                                          </div>
                                        </div>
                                        {values.reviews.length > 1 && (
                                          <div className="col-12">
                                            <button
                                              type="button"
                                              className="btn btn-danger btn-sm"
                                              onClick={() => removeReviewEntry(setFieldValue, values, index)}
                                            >
                                              <LuTrash2 size={16} className="me-1" />
                                              Remove
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                  <div className="row attributeRepeaterWrapper">
                                    <div className="col-12">
                                      <button
                                        type="button"
                                        className="notButton"
                                        onClick={() => addReviewEntry(setFieldValue, values)}
                                      >
                                        <div className="d-flex align-items-center justify-content-center gap-1">
                                          <span>Add More</span>
                                          <LuPlusCircle size={18} />
                                        </div>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* <div className="col-12">
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
                              </div> */}
                              {/* Pros */}
                              <div className="col-12">
                                <div className="mb-3">
                                  <label className="mb-2">
                                    Pros <span className="text-danger">*</span>
                                  </label>
                                  {values.pros.map((pro, index) => (
                                    <div key={index} className="d-flex gap-2 mb-2">
                                      <div className="flex-grow-1">
                                        <CustomInput
                                          id={`pros[${index}]`}
                                          name={`pros[${index}]`}
                                          type="text"
                                          placeholder="Enter Pro"
                                          value={pro}
                                          onChange={(e) => {
                                            const newPros = [...values.pros];
                                            newPros[index] = e.target.value;
                                            setFieldValue('pros', newPros);
                                          }}
                                          onBlur={handleBlur}
                                          error={touched.pros?.[index] && errors.pros?.[index]}
                                        />
                                      </div>
                                      {values.pros.length > 1 && (
                                        <button
                                          type="button"
                                          className="btn btn-danger btn-sm"
                                          onClick={() => removeProsEntry(setFieldValue, values, index)}
                                        >
                                          <LuTrash2 size={16} />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    className="notButton"
                                    onClick={() => addProsEntry(setFieldValue, values)}
                                  >
                                    <div className="d-flex align-items-center justify-content-center gap-1">
                                      <span>Add More</span>
                                      <LuPlusCircle size={18} />
                                    </div>
                                  </button>
                                </div>
                              </div>
                              {/* Cons */}
                              <div className="col-12">
                                <div className="mb-3">
                                  <label className="mb-2">
                                    Cons <span className="text-danger">*</span>
                                  </label>
                                  {values.cons.map((con, index) => (
                                    <div key={index} className="d-flex gap-2 mb-2">
                                      <div className="flex-grow-1">
                                        <CustomInput
                                          id={`cons[${index}]`}
                                          name={`cons[${index}]`}
                                          type="text"
                                          placeholder="Enter Con"
                                          value={con}
                                          onChange={(e) => {
                                            const newCons = [...values.cons];
                                            newCons[index] = e.target.value;
                                            setFieldValue('cons', newCons);
                                          }}
                                          onBlur={handleBlur}
                                          error={touched.cons?.[index] && errors.cons?.[index]}
                                        />
                                      </div>
                                      {values.cons.length > 1 && (
                                        <button
                                          type="button"
                                          className="btn btn-danger btn-sm"
                                          onClick={() => removeConsEntry(setFieldValue, values, index)}
                                        >
                                          <LuTrash2 size={16} />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    className="notButton"
                                    onClick={() => addConsEntry(setFieldValue, values)}
                                  >
                                    <div className="d-flex align-items-center justify-content-center gap-1">
                                      <span>Add More</span>
                                      <LuPlusCircle size={18} />
                                    </div>
                                  </button>
                                </div>
                              </div>
                              {/* Status */}
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
                              {/* Product Images */}
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
