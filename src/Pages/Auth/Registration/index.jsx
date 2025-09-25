import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { useForm } from '../../../Hooks/useForm';

import RegisterUser from './Services/Register';
import GetStates from '../../../Services/getStates';
import GetCities from '../../../Services/getCities';
import GetBusinessFormData from '../../../Services/getBusinessFormData';
import RegisterBusinessProfile from './Services/RegisterBusinessProfile';

import Signup from './Steps/Signup';
import SetupBusiness from './Steps/SetupBusiness';
import ComplianceSetup from './Steps/ComplianceSetup';
import ComplianceReview from './Steps/ComplianceReview';

import { showToast } from '../../../Components/CustomToast';

import CustomInput from '../../../Components/CustomInput';
import CustomSelect from '../../../Components/CustomSelect';
import CustomButton from '../../../Components/CustomButton';
import CustomImageUploader from '../../../Components/CustomImageUploader';
import CustomRadio from '../../../Components/CustomRadio';

import './style.css';

const Registration = () => {
  const [registrationStep, setRegistrationStep] = useState('signup');
  const [signUpToken, setSignUpToken] = useState(null);
  const [countryId, setCountryId] = useState(null);
  const [stateId, setStateId] = useState(null);
  const [cityId, setCityId] = useState(null);

  const [businessStepData, setBusinessStepData] = useState(null);
  const [complianceStepData, setComplianceStepData] = useState(null);

  const {
    data: businessFormData,
    isLoading: isBusinessFormDataLoading,
    isError: isBusinessFormDataError,
  } = useQuery({
    queryKey: ['businessFormData'],
    queryFn: () => GetBusinessFormData(),
  });

  const {
    data: statesData,
    isLoading: isStatesDataLoading,
    isError: isStatesDataError,
    refetch: refetchStates,
  } = useQuery({
    queryKey: ['statesData', countryId],
    queryFn: () => GetStates(countryId),
    enabled: false,
  });

  const {
    data: citiesData,
    isLoading: isCitiesDataLoading,
    isError: isCitiesDataError,
    refetch: refetchCities,
  } = useQuery({
    queryKey: ['citiesData', stateId],
    queryFn: () => GetCities(stateId),
    enabled: false,
  });

  const { mutate: registerMutation, isLoading: isRegisterLoading } = useForm({
    showSuccessToast: false,
    onSuccess: (response) => {
      setSignUpToken(response.token);
      showToast(response.message, 'success');
      setRegistrationStep('businessProfile');
    },
  });

  const {
    mutate: businessRegisterMutation,
    isLoading: isBusinessRegisterLoading,
  } = useForm({
    showSuccessToast: false,
    onSuccess: (response) => {
      showToast(response.message, 'success');
      setRegistrationStep('payment');
    },
  });

  useEffect(() => {
    if (businessFormData?.countries[0]?.value) {
      setCountryId(businessFormData?.countries[0]?.value);
    }
  }, [businessFormData]);

  useEffect(() => {
    if (countryId && !statesData && !isStatesDataLoading) {
      refetchStates();
    }
  }, [countryId, refetchStates, statesData, isStatesDataLoading]);

  useEffect(() => {
    if (statesData && statesData[0]?.value) {
      setStateId(statesData[0]?.value);
    }
  }, [statesData]);

  useEffect(() => {
    if (stateId && !citiesData && !isCitiesDataLoading) {
      refetchCities();
    }
  }, [stateId, refetchCities, citiesData, isCitiesDataLoading]);

  useEffect(() => {
    if (citiesData && citiesData[0]?.value) {
      setCityId(citiesData[0]?.value);
    }
  }, [citiesData]);

  const handleSignUp = (values) => {
    let dialCode = null;
    let cleanPhone = null;

    if (values.phone) {
      try {
        const phoneObj = parsePhoneNumber(values.phone);
        if (phoneObj) {
          dialCode = phoneObj.countryCallingCode;
          cleanPhone = phoneObj.nationalNumber;
        }
      } catch (error) {
        console.error('Invalid phone number:', error);
        return;
      }
    }
    const formDataToSend = new FormData();
    formDataToSend.append('type', 'vendor');
    formDataToSend.append('first_name', values.first_name);
    formDataToSend.append('last_name', values.last_name);
    formDataToSend.append('email', values.email);
    formDataToSend.append('password', values.password);
    formDataToSend.append(
      'password_confirmation',
      values.password_confirmation
    );
    formDataToSend.append('dial_code', dialCode);
    formDataToSend.append('phone', cleanPhone);
    formDataToSend.append('profile_image', values.profile_image);

    registerMutation({
      service: RegisterUser,
      data: formDataToSend,
    });
  };

  const handleNonAlcoholicBusinessSubmit = (values) => {
    const formDataToSend = new FormData();
    formDataToSend.append('name', values.name);
    formDataToSend.append('category_id', values.category_id);
    formDataToSend.append('type_id', values.type_id);
    formDataToSend.append('country_id', countryId);
    formDataToSend.append('state_id', stateId);
    formDataToSend.append('city_id', cityId);
    formDataToSend.append('ein', values.ein);
    formDataToSend.append('vat_id', values.vat_id);
    formDataToSend.append('referral_code', values.referral_code);
    formDataToSend.append('intend_to_sell_or_promote_alcoholic', 0);
    formDataToSend.append('commission_rate', values.commission_rate);
    formDataToSend.append('profile_image', values.business_image);
    businessRegisterMutation({
      service: RegisterBusinessProfile,
      data: { data: formDataToSend, token: signUpToken },
    });

  };

  const handleAlcoholicBusinessSubmit = (values) => {
    setBusinessStepData(values);
    setRegistrationStep('complianceSetup');
  };

  const handleComplianceSubmit = (values) => {
    setComplianceStepData(values);
    setRegistrationStep('reviewAndSubmit');
  };

  const handleComplianceReviewSubmit = () => {
    const dataToSend = {
      ...businessStepData,
      ...complianceStepData,
    };
    const formDataToSend = new FormData();

    formDataToSend.append('name', dataToSend.name);
    formDataToSend.append('category_id', dataToSend.category_id);
    formDataToSend.append('type_id', dataToSend.type_id);
    formDataToSend.append('country_id', countryId);
    formDataToSend.append('state_id', stateId);
    formDataToSend.append('city_id', cityId);
    formDataToSend.append('ein', dataToSend.ein);
    formDataToSend.append('vat_id', dataToSend.vat_id);
    formDataToSend.append('referral_code', dataToSend.referral_code);
    formDataToSend.append('intend_to_sell_or_promote_alcoholic', 1);
    formDataToSend.append('commission_rate', 10);
    formDataToSend.append('profile_image', dataToSend.business_image);
    formDataToSend.append('license[license_number]', dataToSend.license);
    formDataToSend.append('license[issued_date]', dataToSend.business_image);
    formDataToSend.append('license[expiration_date]', dataToSend.certificate);
    formDataToSend.append('license[status]', 1);
    formDataToSend.append('license[medias][license]', dataToSend.license_image);
    formDataToSend.append(
      'license[medias][certificate]',
      dataToSend.certificate_image
    );
    formDataToSend.append('license[certificate_id]', dataToSend.certificate);
    // setRegistrationStep('payment');
    businessRegisterMutation({
      service: RegisterBusinessProfile,
      data: { data: formDataToSend, token: signUpToken },
    });
  };

  return (
    <div>
      <div className="formCardWrapper mx-auto">
        <div className="formCard">
          {registrationStep == 'signup' && (
            <>
              <Signup
                handleSubmit={handleSignUp}
                isLoading={isRegisterLoading}
              />
            </>
          )}
          {registrationStep == 'businessProfile' && (
            <>
              <SetupBusiness
                businessFormData={businessFormData}
                isBusinessFormDataLoading={isBusinessFormDataLoading}
                isBusinessFormDataError={isBusinessFormDataError}
                statesData={statesData}
                isStatesDataLoading={isStatesDataLoading}
                isStatesDataError={isStatesDataError}
                citiesData={citiesData}
                isCitiesDataLoading={isCitiesDataLoading}
                isCitiesDataError={isCitiesDataError}
                setCountryId={setCountryId}
                setStateId={setStateId}
                setCityId={setCityId}
                handleSubmitNonAlcoholic={handleNonAlcoholicBusinessSubmit}
                handleSubmitAlcoholic={handleAlcoholicBusinessSubmit}
                isBusinessRegisterLoading={isBusinessRegisterLoading}
              />
            </>
          )}
          {registrationStep == 'complianceSetup' && (
            <>
              <ComplianceSetup handleSubmit={handleComplianceSubmit} />
            </>
          )}
          {registrationStep == 'reviewAndSubmit' && (
            <>
              <ComplianceReview
                handleSubmit={handleComplianceReviewSubmit}
                complianceStepData={complianceStepData}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Registration;
