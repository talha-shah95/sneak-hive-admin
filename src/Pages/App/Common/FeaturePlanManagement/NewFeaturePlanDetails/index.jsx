import React from 'react';
import { useParams } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useForm } from '../../../../../Hooks/useForm';

import GetNewFeaturePlanDetails from './Services/GetNewFeaturePlanDetails';
import PayNowFeaturePlan from './Services/PayNowFeaturePlan';

import PageTitle from '../../../../../Components/PageTitle';
import CustomCard from '../../../../../Components/CustomCard';
import CustomButton from '../../../../../Components/CustomButton';
import LineSkeleton from '../../../../../Components/SkeletonLoaders/LineSkeleton';

const NewFeaturePlanDetails = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    data: newFeaturePlanDetailsData,
    isLoading: isNewFeaturePlanDetailsLoading,
    isError: isNewFeaturePlanDetailsError,
    error: newFeaturePlanDetailsError,
  } = useQuery({
    queryKey: ['newFeaturePlanDetails', id],
    queryFn: () => GetNewFeaturePlanDetails(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  const { mutate: payNowMutation, isLoading: isPayNowLoading } = useForm({
    showSuccessToast: false,
    onSuccess: (data) => {
      console.log(data);
      window.open(data.payment_link, '_blank');
      queryClient.invalidateQueries(['featurePlans']);
    },
    onError: (error) => {
      console.error('Feature plan add failed:', error);
    },
  });

  const handlePayNow = () => {
    payNowMutation({
      service: PayNowFeaturePlan,
      data: {
        id,
        data: {
          redirectionLink:
            'http://localhost:5173/bevmatch/feature-plan-management',
        },
      },
    });
    console.log('Pay Now');
  };

  return (
    <div className="newFeaturePlanDetailsScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title="View New Feature Plan"
            backButton={true}
            backLink={'/feature-plan-management'}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            {isNewFeaturePlanDetailsError ? (
              <p className="text-center fs-4 my-4 text-danger">
                {newFeaturePlanDetailsError || 'Something went wrong'}
              </p>
            ) : (
              <>
                <div className="row newFeaturePlanDetails my-3">
                  <div className="col-xl-10 order-xl-1">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <p className="textLabel">Shop Feature plan Title:</p>
                          {isNewFeaturePlanDetailsLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {newFeaturePlanDetailsData?.title || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <p className="textLabel">Duration:</p>
                          {isNewFeaturePlanDetailsLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {`${newFeaturePlanDetailsData?.duration}`}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <p className="textLabel">Amount:</p>
                          {isNewFeaturePlanDetailsLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              ${newFeaturePlanDetailsData?.amount || '0'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <p className="textLabel">Description:</p>
                          {isNewFeaturePlanDetailsLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {newFeaturePlanDetailsData?.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="d-flex align-items-center gap-3">
                      <CustomButton
                        text="Pay Now"
                        onClick={handlePayNow}
                        loading={isPayNowLoading}
                        disabled={
                          isNewFeaturePlanDetailsLoading || isPayNowLoading
                        }
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

export default NewFeaturePlanDetails;
