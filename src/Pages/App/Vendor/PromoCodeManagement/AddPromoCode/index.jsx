import React from 'react';

import { Formik, Form } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useForm } from '../../../../../Hooks/useForm';

import useModalStore from '../../../../../Store/ModalStore';

import AddPromoCodeService from './Services/AddPromoCode';

import { generatePromoCode } from '../Utils';

import { addPromoCodeValidationSchema } from './Validations';
import { promoCodeStatus, discountInPercentage } from '../Constants';

import PageTitle from '../../../../../Components/PageTitle';
import CustomCard from '../../../../../Components/CustomCard';
import CustomInput from '../../../../../Components/CustomInput';
import CustomButton from '../../../../../Components/CustomButton';
import CustomSelect from '../../../../../Components/CustomSelect';

import { SlRefresh } from 'react-icons/sl';

const AddPromoCode = () => {
  const queryClient = useQueryClient();
  const { showModal, closeModal } = useModalStore();
  const navigate = useNavigate();

  const { mutate: addPromoCodeMutation, isLoading } = useForm({
    showSuccessToast: false,
    onSuccess: () => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          message: 'Promocode has been added successfully!',
          continueText: 'Okay',
          onContinue: async () => {
            queryClient.invalidateQueries(['promoCodes']);
            closeModal();
            navigate('/promo-code-management');
          },
        },
      });
    },
    onError: (error) => {
      console.error('Product add failed:', error);
    },
  });

  const handleSubmit = (values) => {
    addPromoCodeMutation({
      service: AddPromoCodeService,
      data: values,
    });
  };

  return (
    <>
      <div className="addPromoCodeScreen">
        <div className="row mb-4">
          <div className="col-12 col-xl-6">
            <PageTitle
              title="Add Promo Code"
              backButton={true}
              backLink={'/promo-code-management'}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-12">
            <CustomCard>
              <>
                <Formik
                  initialValues={{
                    promo_code: generatePromoCode({
                      lettersCount: 2,
                      digitsCount: 4,
                      withHyphen: false,
                    }),
                    minimum_spend: '0',
                    discount_in_percentage:
                      discountInPercentage[0]?.value || '5',
                    status: promoCodeStatus[0]?.value || 1,
                  }}
                  validationSchema={addPromoCodeValidationSchema}
                  onSubmit={handleSubmit}
                  reinitialize={true}
                >
                  {({ values, errors, touched, handleChange, handleBlur }) => {
                    return (
                      <Form>
                        <div className="row mb-4">
                          <div className="col-xl-10">
                            <div className="row">
                              <div className="col-lg-6">
                                <div className="mb-3 d-flex align-items-end gap-3">
                                  <CustomInput
                                    label="Promo Code"
                                    id="promo_code"
                                    name="promo_code"
                                    type="text"
                                    placeholder="Enter Promo Code"
                                    value={values.promo_code}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      touched.promo_code && errors.promo_code
                                    }
                                    readOnly
                                    wrapperClassName="flex-grow-1"
                                  />
                                  <button
                                    style={{ minWidth: 'auto' }}
                                    type="button"
                                    className="mb-3 customButton primary w-auto"
                                    onClick={() => {
                                      handleChange({
                                        target: {
                                          name: 'promo_code',
                                          value: generatePromoCode({
                                            lettersCount: 2,
                                            digitsCount: 4,
                                            withHyphen: false,
                                          }),
                                        },
                                      });
                                    }}
                                  >
                                    <SlRefresh />
                                  </button>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <CustomInput
                                    label="Minimum Spend"
                                    id="minimum_spend"
                                    name="minimum_spend"
                                    type="text"
                                    placeholder="Enter Minimum Spend"
                                    value={values.minimum_spend}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      touched.minimum_spend &&
                                      errors.minimum_spend
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <CustomSelect
                                    label="Specify Discount in Percentage"
                                    id="discount_in_percentage "
                                    name="discount_in_percentage"
                                    placeholder="Select Discount In Percentage"
                                    className="w-100 fw-normal"
                                    labelClassName="mb-0"
                                    fullWidth
                                    options={discountInPercentage}
                                    disabled={!discountInPercentage}
                                    value={values.discount_in_percentage}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      touched.discount_in_percentage &&
                                      errors.discount_in_percentage
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <CustomSelect
                                    label="Status"
                                    id="status "
                                    name="status"
                                    placeholder="Select Status"
                                    className="w-100 fw-normal"
                                    labelClassName="mb-0"
                                    fullWidth
                                    options={promoCodeStatus}
                                    disabled={!promoCodeStatus}
                                    value={values.status}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.status && errors.status}
                                    required
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
                                text="Add Promo Code"
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

export default AddPromoCode;
