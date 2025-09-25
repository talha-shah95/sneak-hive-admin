import React from 'react';
import { useParams } from 'react-router-dom';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import GetPromoCodeDetails from './Services/GetPromoCodeDetails';
import ChangePromoCodeStatus from '../Services/ChangePromoCodeStatus';

import { dateFormat } from '../../../../../Utils/Utils';

import { showToast } from '../../../../../Components/CustomToast';
import PageTitle from '../../../../../Components/PageTitle';
import CustomCard from '../../../../../Components/CustomCard';
import CustomButton from '../../../../../Components/CustomButton';
import LineSkeleton from '../../../../../Components/SkeletonLoaders/LineSkeleton';
import StatusDropdown from '../../../../../Components/StatisDropdown';
import useModalStore from '../../../../../Store/ModalStore';

import './style.css';

const PromoCodeDetails = () => {
  const { id } = useParams();
  const { showModal, closeModal } = useModalStore();
  const queryClient = useQueryClient();
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

  const { mutateAsync: changeStatusMutation } = useMutation({
    mutationFn: (id) => ChangePromoCodeStatus(id),
    onSuccess: ({ message }) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message: message || 'Promo Code has been activated successfully!',
          continueText: 'Okay',
          onContinue: () => {
            closeModal();
          },
        },
      });
      queryClient.invalidateQueries({ queryKey: ['promoCodeDetails'] });
    },
    onError: (error) => {
      showToast(error?.message || 'Status change failed', 'error');
    },
  });

  const handleChangeStatus = (id, status) => {
    const title =
      status == 1 ? 'Deactivate Promo Code?' : 'Activate Promo Code?';
    const message =
      status == 1
        ? 'Are you sure you want to deactivate the Promo Code?'
        : 'Are you sure you want to activate the Promo Code?';
    showModal({
      type: 'question',
      modalProps: {
        title: title,
        message: message,
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          await changeStatusMutation(id);
        },
      },
    });
  };

  return (
    <div className="promoCodeDetailsScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title="View Promo Code"
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
                <div className="row promoCodeDetails my-3">
                  <div className="col-xl-2 order-xl-2 text-end">
                    <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                      <p className="textLabel">Status:</p>
                      {isPromoCodeDetailsLoading ? (
                        <LineSkeleton />
                      ) : (
                        <StatusDropdown
                          variant="secondary"
                          selected={
                            promoCodeDetailsData?.status == 0
                              ? { value: 0, label: 'Deactivate' }
                              : promoCodeDetailsData?.status == 1
                              ? { value: 1, label: 'Activate' }
                              : { value: 2, label: 'Pending' }
                          }
                          options={[
                            {
                              value: promoCodeDetailsData?.status == 1 ? 0 : 1,
                              label:
                                promoCodeDetailsData?.status == 1
                                  ? 'Deactivate'
                                  : 'Activate',
                              onClick: () => {
                                handleChangeStatus(
                                  promoCodeDetailsData?.id,
                                  promoCodeDetailsData?.status
                                );
                              },
                            },
                          ]}
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-xl-10 order-xl-1">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-12">
                            <div className="mb-3">
                              <p className="textLabel">Promo code:</p>
                              {isPromoCodeDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  {promoCodeDetailsData?.promo_code || 'N/A'}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="mb-3">
                              <p className="textLabel">
                                Specify Discount in Percentage:
                              </p>
                              {isPromoCodeDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  {`${promoCodeDetailsData?.discount_in_percentage}%`}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="mb-3">
                              <p className="textLabel">Minimum Spend:</p>
                              {isPromoCodeDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  {promoCodeDetailsData?.minimum_spend}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="mb-3">
                              <p className="textLabel">Added On:</p>
                              {isPromoCodeDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  {dateFormat(promoCodeDetailsData?.created_at)}
                                </p>
                              )}
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
                        text="Edit"
                        tabIndex={3}
                        to={`/promo-code-management/edit-promo-code/${id}`}
                        disabled={isPromoCodeDetailsLoading}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </CustomCard>
        </div>
      </div>
    </div>
  );
};

export default PromoCodeDetails;
