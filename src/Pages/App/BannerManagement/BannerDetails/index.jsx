import React from 'react';
import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import GetBanner from './Services/GetBanner';

import { images } from '../../../../assets/images';

import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import LineSkeleton from '../../../../Components/SkeletonLoaders/LineSkeleton';
import CustomButton from '../../../../Components/CustomButton';

const BannerDetails = () => {
  const { id } = useParams();

  const {
    data: bannerDetailsData,
    isLoading: isBannerDetailsLoading,
    isError: isBannerDetailsError,
    error: bannerDetailsError,
  } = useQuery({
    queryKey: ['banners', 'bannerDetails', id],
    queryFn: () => GetBanner(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  return (
    <div className="brandDetailsScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title="View Banner Details"
            backButton={true}
            backLink={'/banner-management'}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            {isBannerDetailsError ? (
              <p className="text-center fs-4 my-4 text-danger">
                {bannerDetailsError || 'Something went wrong'}
              </p>
            ) : (
              <>
                <div className="row bannerDetails my-3">
                  <div className="col-xl-2 order-xl-2 text-end">
                    <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                      <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                        <p className="textLabel">Status:</p>
                        {isBannerDetailsLoading ? (
                          <LineSkeleton width="120px" />
                        ) : (
                          <p
                            className={`text-capitalize ${
                              bannerDetailsData?.is_active == 1
                                ? 'colorGreen'
                                : bannerDetailsData?.is_active == 0
                                ? 'colorRed'
                                : 'colorYellowDark'
                            }`}
                          >
                            {bannerDetailsData?.is_active == 1
                              ? 'Active'
                              : bannerDetailsData?.is_active == 0
                              ? 'Inactive'
                              : 'Pending'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-10 order-xl-1">
                    <div className="row mb-4">
                      <div className="col-12">
                        <div className="mb-3">
                          <p className="textLabel">Introductory Heading:</p>
                          {isBannerDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {bannerDetailsData?.heading || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12 ">
                        <div className="mb-3">
                          <p className="textLabel">Introductory Banner:</p>
                          {isBannerDetailsLoading ? (
                            <LineSkeleton
                              width="160px"
                              height="160px"
                              borderRadius="10px"
                            />
                          ) : (
                            <div className="squareImageWrapper">
                              <img
                                className="squareImage"
                                src={
                                  bannerDetailsData?.image ||
                                  images?.defaultPlaceholder
                                }
                                onError={(e) => {
                                  e.target.src = images?.defaultPlaceholder;
                                }}
                                alt="Brand"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <CustomButton
                          text="Edit Banner"
                          variant="secondary"
                          className="w-auto d-inline-block"
                          to={`/banner-management/edit-banner/${id}`}
                          disabled={isBannerDetailsLoading}
                        />
                      </div>
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

export default BannerDetails;
