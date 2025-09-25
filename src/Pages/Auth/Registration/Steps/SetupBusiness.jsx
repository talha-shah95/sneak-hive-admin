import React, { useState } from 'react';

import { Formik, Form } from 'formik';

import CustomImageUploader from '../../../../Components/CustomImageUploader';
import CustomInput from '../../../../Components/CustomInput';
import CustomRadio from '../../../../Components/CustomRadio';
import CustomSelect from '../../../../Components/CustomSelect';
import CustomButton from '../../../../Components/CustomButton';
import CustomCheckbox from '../../../../Components/CustomCheckBox';

const SetupBusiness = ({
  businessFormData,
  isBusinessFormDataLoading,
  isBusinessFormDataError,
  statesData,
  isStatesDataLoading,
  isStatesDataError,
  citiesData,
  isCitiesDataLoading,
  isCitiesDataError,
  setCountryId,
  setStateId,
  setCityId,
  handleSubmitNonAlcoholic,
  handleSubmitAlcoholic,
  isBusinessRegisterLoading,
}) => {
  const [intendToSellOrPromoteAlcoholic, setIntendToSellOrPromoteAlcoholic] =
    useState(false);

  const handleIntendToSellOrPromoteAlcoholic = () => {
    setIntendToSellOrPromoteAlcoholic(!intendToSellOrPromoteAlcoholic);
  };

  const handleSubmitForm = (e) => {
    const dataToSend = {
      ...e,
      intend_to_sell_or_promote_alcoholic: intendToSellOrPromoteAlcoholic,
      city_id: 1,
      commission_rate: 10,
    };

    if (intendToSellOrPromoteAlcoholic) {
      handleSubmitAlcoholic(dataToSend);
    } else {
      handleSubmitNonAlcoholic(dataToSend);
    }
  };

  return (
    <>
      <h2 className="text-center mb-2">Setup Your Business Profile</h2>
      <p className="text-center colorRed">
        Note: You can create dual business accounts using different email
        addresses, each with its own commission rate.
      </p>
      <div className="mt-4">
        <Formik
          initialValues={{
            name: '',
            category_id: businessFormData?.business_categories[0]?.value || '',
            type_id: businessFormData?.business_types[0]?.value || '',
            country_id: businessFormData?.countries[0]?.value || '',
            state_id: '',
            city_id: '',
            ein: '',
            vat_id: '',
            referral_code: '0',
          }}
          // validationSchema={businessProfileValidationSchema}
          onSubmit={handleSubmitForm}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form>
              <div className="row mb-4 businessDetails">
                <div className="col-12">
                  <CustomInput
                    type={'text'}
                    label={'Business Name'}
                    required
                    name="name"
                    id="name"
                    placeholder={'Enter Business Name'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    error={touched.name && errors.name}
                    fullWidth
                  />
                </div>
                <div className="col-12">
                  <CustomSelect
                    type={'text'}
                    label={'Business Category'}
                    required
                    name="category_id"
                    id="category_id"
                    options={businessFormData?.business_categories}
                    disabled={
                      isBusinessFormDataLoading || isBusinessFormDataError
                    }
                    value={values.category_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.category_id && errors.category_id}
                    fullWidth
                    className="fw-normal"
                    wrapperClassName="mb-3"
                  />
                </div>
                <div className="col-12">
                  <CustomSelect
                    type={'text'}
                    label={'Business Type'}
                    required
                    name="type_id"
                    id="type_id"
                    options={businessFormData?.business_types}
                    disabled={
                      isBusinessFormDataLoading || isBusinessFormDataError
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.type_id}
                    error={touched.type_id && errors.type_id}
                    fullWidth
                    className="fw-normal"
                    wrapperClassName="mb-3"
                  />
                </div>
                <div className="col-12">
                  <CustomSelect
                    type={'text'}
                    label={'Country'}
                    required
                    name="country_id"
                    id="country_id"
                    options={businessFormData?.countries}
                    disabled={
                      isBusinessFormDataLoading || isBusinessFormDataError
                    }
                    onChange={(e) => {
                      setCountryId(e.target.value);
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    value={values.country_id}
                    error={touched.country_id && errors.country_id}
                    fullWidth
                    className="fw-normal"
                    wrapperClassName="mb-3"
                  />
                </div>
                <div className="col-12">
                  <CustomSelect
                    type={'text'}
                    label={'State'}
                    required
                    name="state_id"
                    id="state_id"
                    options={statesData || []}
                    disabled={
                      !statesData || isStatesDataLoading || isStatesDataError
                    }
                    onChange={(e) => {
                      setStateId(e.target.value);
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    value={values.state_id}
                    error={touched.state_id && errors.state_id}
                    fullWidth
                    className="fw-normal"
                    wrapperClassName="mb-3"
                  />
                </div>
                <div className="col-12">
                  <CustomSelect
                    type={'text'}
                    label={'City'}
                    required
                    name="city_id"
                    id="city_id"
                    options={citiesData || []}
                    disabled={
                      !citiesData ||
                      isCitiesDataLoading ||
                      isCitiesDataError ||
                      !statesData ||
                      isStatesDataLoading ||
                      isStatesDataError
                    }
                    onChange={(e) => {
                      setCityId(e.target.value);
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    value={values.city_id}
                    error={touched.city_id && errors.city_id}
                    fullWidth
                    className="fw-normal"
                    wrapperClassName="mb-3"
                  />
                </div>
              </div>
              <div className="row businessTaxDetails">
                <h2 className="mb-4">Business Tax ID (EIN / VAT ID)</h2>
                <div className="col-lg-6">
                  {' '}
                  <CustomInput
                    type={'text'}
                    label={'EIN'}
                    required
                    name="ein"
                    id="ein"
                    placeholder={'Enter EIN'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.ein}
                    error={touched.ein && errors.ein}
                    fullWidth
                  />
                </div>
                <div className="col-lg-6">
                  <CustomInput
                    type={'text'}
                    label={'VAT ID'}
                    required
                    name="vat_id"
                    id="vat_id"
                    placeholder={'Enter VAT ID'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.vat_id}
                    error={touched.vat_id && errors.vat_id}
                    fullWidth
                  />
                </div>
                <div className="col-12">
                  <CustomImageUploader
                    label="Business Profile Image"
                    required
                    id="business_image"
                    name="business_image"
                    placeholder="Upload Business Profile Image"
                    onChange={(e) => {
                      handleChange({
                        target: {
                          name: 'business_image',
                          value: e.target.files[0],
                        },
                      });
                    }}
                    onBlur={handleBlur}
                    value={values.business_image}
                  />
                </div>
                <div className="col-12">
                  <div className="mb-3">
                    <p className="textLabel">
                      Referral Codes <span className="text-danger">*</span>:
                    </p>
                    <div className="d-flex align-items-center gap-3 mt-2">
                      <CustomRadio
                        label="Enable"
                        name="referral_code"
                        id="referral_code_enable"
                        value={1}
                        checked={values.referral_code == '1'}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <CustomRadio
                        label="Disable"
                        name="referral_code"
                        id="referral_code_disable"
                        value={0}
                        checked={values.referral_code == '0'}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="mb-3">
                    <CustomCheckbox
                      label="We intend to sell or promote alcoholic beverages on BevMatch"
                      id="intend_to_sell_or_promote_alcoholic"
                      checked={intendToSellOrPromoteAlcoholic}
                      onChange={handleIntendToSellOrPromoteAlcoholic}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <CustomButton
                    type="submit"
                    text={`${
                      intendToSellOrPromoteAlcoholic
                        ? 'Continue to Compliance Setup'
                        : 'Finalize Profile Setup'
                    }`}
                    // onClick={() => handleSubmitForm(values)}
                    loading={isBusinessRegisterLoading}
                    // disabled={isLoading}
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default SetupBusiness;
