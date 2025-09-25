import React from 'react';

import { Formik, Form } from 'formik';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { useForm } from '../../../../../Hooks/useForm';

import useModalStore from '../../../../../Store/ModalStore';

import GetPromoCodeDetails from '../PromoCodeDetails/Services/GetPromoCodeDetails';
import EditPromoCodeService from './Services/EditPromoCode';

import { editPromoCodeValidationSchema } from './Validations';
import { promoCodeStatus, discountInPercentage } from '../Constants';

import PageTitle from '../../../../../Components/PageTitle';
import CustomCard from '../../../../../Components/CustomCard';
import CustomInput from '../../../../../Components/CustomInput';
import CustomButton from '../../../../../Components/CustomButton';
import CustomSelect from '../../../../../Components/CustomSelect';
import LineSkeleton from '../../../../../Components/SkeletonLoaders/LineSkeleton';

const EditPromoCode = () => {
  const queryClient = useQueryClient();
  const { showModal, closeModal } = useModalStore();
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: promoCodeDetailsData,
    isLoading: isPromoCodeDetailsLoading,
    isError: isPromoCodeDetailsError,
    error: promoCodeDetailsError,
  } = useQuery({
    queryKey: ['promoCodeDetails', id],
    queryFn: () => GetPromoCodeDetails(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  const { mutate: editPromoCodeMutation, isLoading } = useForm({
    showSuccessToast: false,
    onSuccess: () => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          message: 'Promocode has been updated successfully!',
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
      console.error('Product update failed:', error);
    },
  });

  const handleSubmit = (values) => {
    editPromoCodeMutation({
      service: EditPromoCodeService,
      data: { id: id, data: values },
    });
  };

  return (
    <>
      <div className="addPromoCodeScreen">
        <div className="row mb-4">
          <div className="col-12 col-xl-6">
            <PageTitle
              title="Edit Promo Code"
              backButton={true}
              backLink={'/promo-code-management'}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-12">
            <CustomCard>
              {isPromoCodeDetailsError ? (
                <p className="text-center fs-4 my-4 text-danger">
                  {promoCodeDetailsError || 'Something went wrong'}
                </p>
              ) : (
                <>
                  {isPromoCodeDetailsLoading ? (
                    <LineSkeleton lines={10} />
                  ) : (
                    <>
                      <Formik
                        initialValues={{
                          promo_code: promoCodeDetailsData?.promo_code || '',
                          minimum_spend:
                            promoCodeDetailsData?.minimum_spend || '0',
                          discount_in_percentage:
                            discountInPercentage[0]?.value ||
                            promoCodeDetailsData?.discount_in_percentage ||
                            '5',
                          status: promoCodeDetailsData?.status || 1,
                        }}
                        validationSchema={editPromoCodeValidationSchema}
                        onSubmit={handleSubmit}
                        reinitialize={true}
                      >
                        {({
                          values,
                          errors,
                          touched,
                          handleChange,
                          handleBlur,
                        }) => {
                          return (
                            <Form>
                              <div className="row mb-4">
                                <div className="col-xl-10">
                                  <div className="row">
                                    <div className="col-lg-6">
                                      <div className="mb-3">
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
                                            touched.promo_code &&
                                            errors.promo_code
                                          }
                                          readOnly
                                          wrapperClassName="flex-grow-1"
                                        />
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
                                          error={
                                            touched.status && errors.status
                                          }
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
                                      text="Update Promo Code"
                                      type="submit"
                                      disabled={isPromoCodeDetailsLoading || isLoading}
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
            </CustomCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPromoCode;
