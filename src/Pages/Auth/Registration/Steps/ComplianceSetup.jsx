import React from 'react';

import { Formik, Form } from 'formik';

import CustomImageUploader from '../../../../Components/CustomImageUploader';
import CustomInput from '../../../../Components/CustomInput';
import CustomRadio from '../../../../Components/CustomRadio';
import CustomSelect from '../../../../Components/CustomSelect';
import CustomButton from '../../../../Components/CustomButton';
import CustomCheckbox from '../../../../Components/CustomCheckBox';

const ComplianceSetup = ({ handleSubmit }) => {
  const handleSubmitForm = (e) => {
    handleSubmit(e);
  };

  return (
    <>
      <h2 className="text-center mb-2">Alcohol Sales Compliance</h2>
      <p className="text-center colorRed">
        To sell alcoholic beverages on BevMatch, we need your valid license and
        resale certificate info.
      </p>
      <div className="mt-4">
        <Formik
          initialValues={{
            license_image: null,
            license_number: '',
            issued_date: '',
            expiration_date: '',
            certificate_image: null,
            certificate_id: '',
            certification: false,
          }}
          // validationSchema={businessProfileValidationSchema}
          onSubmit={handleSubmitForm}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form>
              <div className="row mb-4 license">
                <div className="col-12">
                  <h2 className="mb-4">Liquor License</h2>
                </div>
                <div className="col-12">
                  <CustomImageUploader
                    label="License"
                    required
                    id="license_image"
                    name="license_image"
                    placeholder="Upload License"
                    onChange={(e) => {
                      handleChange({
                        target: {
                          name: 'license_image',
                          value: e.target.files[0],
                        },
                      });
                    }}
                    onBlur={handleBlur}
                    value={values.license_image}
                  />
                </div>
                <div className="col-12">
                  <CustomInput
                    type={'text'}
                    label={'License Number'}
                    required
                    name="license_number"
                    id="license_number"
                    placeholder={'Enter License Number'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.license_number}
                    error={touched.license_number && errors.license_number}
                    fullWidth
                  />
                </div>
                <div className="col-6">
                  <CustomInput
                    type={'date'}
                    label={'Issued Date'}
                    required
                    name="issued_date"
                    id="issued_date"
                    placeholder={'Enter Issued Date'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.issued_date}
                    error={touched.issued_date && errors.issued_date}
                    fullWidth
                  />
                </div>
                <div className="col-6">
                  <CustomInput
                    type={'date'}
                    label={'Expiration Date'}
                    required
                    name="expiration_date"
                    id="expiration_date"
                    placeholder={'Enter Expiration Date'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.expiration_date}
                    error={touched.expiration_date && errors.expiration_date}
                    fullWidth
                  />
                </div>
              </div>
              <div className="row mb-4 resaleCertificate">
                <div className="col-12">
                  <h2 className="mb-4">Resale Certificate</h2>
                </div>
                <div className="col-12">
                  <CustomImageUploader
                    label="Certificate"
                    required
                    id="certificate_image"
                    name="certificate_image"
                    placeholder="Upload Certificate"
                    onChange={(e) => {
                      handleChange({
                        target: {
                          name: 'certificate_image',
                          value: e.target.files[0],
                        },
                      });
                    }}
                    onBlur={handleBlur}
                    value={values.certificate_image}
                  />
                </div>
                <div className="col-12">
                  <CustomInput
                    type={'text'}
                    label={'Certificate ID'}
                    required
                    name="certificate_id"
                    id="certificate_id"
                    placeholder={'Enter Certificate ID'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.certificate_id}
                    error={touched.certificate_id && errors.certificate_id}
                    fullWidth
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12 mb-4">
                  <CustomCheckbox
                    label="I certify that these documents are accurate, current, and legally valid"
                    name="certification"
                    id="certification"
                    checked={values.certification}
                    onChange={() => {
                      handleChange({
                        target: {
                          name: 'certification',
                          value: !values.certification,
                        },
                      });
                    }}
                    onBlur={handleBlur}
                    value={values.certification}
                  />
                </div>
                <div className="col-12">
                  <CustomButton
                    type="submit"
                    text={`Review and Submit Document`}
                    // loading={isLoading}
                    disabled={!values.certification}
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

export default ComplianceSetup;
