import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useForm } from '../../../../../Hooks/useForm';

import GetAdDetails from './Services/GetAdDetails';
import PayNowAd from './Services/PayNowAd';

import { images } from '../../../../../assets/images';

import PageTitle from '../../../../../Components/PageTitle';
import CustomCard from '../../../../../Components/CustomCard';
import LineSkeleton from '../../../../../Components/SkeletonLoaders/LineSkeleton';
import CustomButton from '../../../../../Components/CustomButton';
import PlanCard from './Components/PlanCard';

const AdDetails = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [adData, setAdData] = useState(null);
  const [planData, setPlanData] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const { mutate: payNowAdMutation, isLoading: isPayNowLoading } = useForm({
    showSuccessToast: false,
    onSuccess: (data) => {
      window.open(data.payment_link, '_blank');
      queryClient.invalidateQueries(['adDetails', 'adLogs']);
    },
    onError: (error) => {
      console.error('Ad request add failed:', error);
    },
  });

  const {
    data: adDetailsData,
    isLoading: isAdDetailsLoading,
    isError: isAdDetailsError,
    error: adDetailsError,
  } = useQuery({
    queryKey: ['adDetails', id],
    queryFn: () => GetAdDetails(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  useEffect(() => {
    if (adDetailsData) {
      setAdData(adDetailsData.data);
      setPlanData(adDetailsData.plans);
      setSelectedPlan(adDetailsData.plans[0]);
    }
  }, [adDetailsData]);

  const handlePayNow = () => {
    payNowAdMutation({
      service: PayNowAd,
      data: {
        adId: id,
        planId: selectedPlan.id,
        data: {
          redirectionLink: 'http://localhost:5173/bevmatch/ad-logs',
        },
      },
    });
  };

  return (
    <div className="adDetailsScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title="View Ad Request"
            backButton={true}
            backLink={'/ad-logs'}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            {isAdDetailsError ? (
              <p className="text-center fs-4 my-4 text-danger">
                {adDetailsError || 'Something went wrong'}
              </p>
            ) : (
              <>
                <div className="row adDetails my-3">
                  <div className="col-xl-2 order-xl-2 text-end">
                    <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                      <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                        <p className="textLabel">Status:</p>
                        {isAdDetailsLoading ? (
                          <LineSkeleton width="120px" />
                        ) : (
                          <p
                            className={`text-capitalize ${
                              adData?.status == 0
                                ? 'colorYellowDark'
                                : adData?.status == 1
                                ? 'colorGreen'
                                : 'colorRed'
                            }`}
                          >
                            {adData?.status_detail || 'N/A'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-10 order-xl-1">
                    <div className="row mb-4">
                      <div className="col-12">
                        <div className="mb-3">
                          <p className="textLabel">Advertisement Title:</p>
                          {isAdDetailsLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {adData?.title || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <p className="textLabel">Email Address:</p>
                          {isAdDetailsLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {adData?.email || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <p className="textLabel">URL:</p>
                          {isAdDetailsLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">{adData?.url || 'N/A'}</p>
                          )}
                        </div>
                      </div>
                      <div className="col-12 ">
                        <div className="mb-3">
                          <p className="textLabel">
                            Pictures and Flyers to be Advertised:
                          </p>
                          {isAdDetailsLoading ? (
                            <LineSkeleton
                              width="160px"
                              height="160px"
                              borderRadius="10px"
                            />
                          ) : (
                            <div className="d-flex gap-2 mt-3">
                              {adData?.medias &&
                                adData?.medias.length > 0 &&
                                adData?.medias.map((item, index) => (
                                  <div className="squareImageWrapper">
                                    <img
                                      key={index}
                                      className="squareImage"
                                      src={item?.media_path}
                                      onError={(e) => {
                                        e.target.src =
                                          images?.defaultPlaceholder;
                                      }}
                                      alt="Ad"
                                    />
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {adData?.status == 2 && (
                        <div className="col-12">
                          <div className="mb-3">
                            <p className="textLabel">Rejection Reason:</p>
                            {isAdDetailsLoading ? (
                              <LineSkeleton />
                            ) : (
                              <p className="textValue">
                                {adData?.rejection_reason || 'N/A'}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    {adData?.status == 1 && (
                      <div className="row mt-5">
                        <div className="col-12">
                          <div className="mb-4">
                            <p className="secondaryTitle mb-3">
                              Select Package:
                            </p>
                            {isAdDetailsLoading ? (
                              <LineSkeleton />
                            ) : (
                              <div className="row">
                                {planData &&
                                  planData.length > 0 &&
                                  planData.map((item, index) => (
                                    <div
                                      className="col-12 col-md-6 col-lg-4"
                                      key={index}
                                    >
                                      <PlanCard
                                        onChange={() => {
                                          console.log('onChange', item);
                                          setSelectedPlan(item);
                                        }}
                                        //   className="d-none"
                                        id="planCard"
                                        name="planCard"
                                        value="planCard"
                                        checked={selectedPlan?.id == item.id}
                                        duration={item.duration}
                                        title={item.title}
                                        price={item.amount}
                                      />
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-center gap-3">
                            <CustomButton
                              text="Next"
                              type="button"
                              onClick={handlePayNow}
                              loading={isPayNowLoading}
                              disabled={isAdDetailsLoading || isPayNowLoading}
                            />
                          </div>
                        </div>
                      </div>
                    )}
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

export default AdDetails;
