import React from 'react';

import { Formik, Form } from 'formik';

import CustomImageUploader from '../../../../Components/CustomImageUploader';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import CustomCheckbox from '../../../../Components/CustomCheckBox';

import { images } from '../../../../assets/images';

const ComplianceReview = ({ handleSubmit, complianceStepData }) => {
  const handleSubmitManualVerification = () => {
    handleSubmit();
  };

  const handleSubmitInstantVerification = () => {
    console.log('submit instant verification');
  };

  return (
    <>
      <h2 className="text-center mb-2">Review and Submit</h2>
      <p className="text-center colorRed">
        Please confirm that all information below is correct. Once submitted,
        our team will review your documentation within 1-2 business days.
      </p>
      <div className="mt-4">
        <div className="row mb-4 license">
          <div className="col-12">
            <h2 className="mb-4">Liquor License</h2>
          </div>
          <div className="col-lg-4">
            <div className="mb-3">
              <p className="textLabel">License Number:</p>
              <p className="textValue">
                #{complianceStepData?.license_number || 'N/A'}
              </p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="mb-3">
              <p className="textLabel">Issued Date:</p>
              <p className="textValue">
                {complianceStepData?.issued_date || 'N/A'}
              </p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="mb-3">
              <p className="textLabel">Expiration Date:</p>
              <p className="textValue">
                {complianceStepData?.expiration_date || 'N/A'}
              </p>
            </div>
          </div>
          <div className="col-12">
            <div className="mb-3">
              <p className="textLabel">License Image:</p>
              <div className="squareImageWrapper">
                <img
                  src={
                    URL.createObjectURL(complianceStepData?.license_image) ||
                    images?.defaultPlaceholder
                  }
                  onError={(e) => {
                    e.target.src = images?.defaultPlaceholder;
                  }}
                  className="squareImage"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-4 resaleCertificate">
          <div className="col-12">
            <h2 className="mb-4">Resale Certificate</h2>
          </div>
          <div className="col-lg-4">
            <div className="mb-3">
              <p className="textLabel">License Number:</p>
              <p className="textValue">
                #{complianceStepData?.license_number || 'N/A'}
              </p>
            </div>
          </div>
          <div className="col-12">
            <div className="mb-3">
              <p className="textLabel">Certificate:</p>
              <div className="squareImageWrapper">
                <img
                  src={
                    URL.createObjectURL(
                      complianceStepData?.certificate_image
                    ) || images?.defaultPlaceholder
                  }
                  onError={(e) => {
                    e.target.src = images?.defaultPlaceholder;
                  }}
                  className="squareImage"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <CustomButton
              type="button"
              text={`Submit for Manual Verification`}
              onClick={handleSubmitManualVerification}
              wrapperClassName="mb-2"
            />
          </div>
          <div className="col-12">
            <CustomButton
              type="button"
              text={`Submit for instant Verification`}
              onClick={handleSubmitInstantVerification}
              variant="secondary"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ComplianceReview;
