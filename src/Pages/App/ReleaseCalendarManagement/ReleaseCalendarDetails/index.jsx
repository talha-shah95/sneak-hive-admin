import React from 'react';
import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import GetReleaseCalendar from './Services/GetReleaseCalendar';

import { dateFormat } from '../../../../Utils/Utils';
import { images } from '../../../../assets/images';

import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import LineSkeleton from '../../../../Components/SkeletonLoaders/LineSkeleton';
import CustomButton from '../../../../Components/CustomButton';

const ReleaseCalendarDetails = () => {
  const { id } = useParams();

  const {
    data: releaseCalendarDetailsData,
    isLoading: isReleaseCalendarDetailsLoading,
    isError: isReleaseCalendarDetailsError,
    error: releaseCalendarDetailsError,
  } = useQuery({
    queryKey: ['releaseCalendarDetails', id],
    queryFn: () => GetReleaseCalendar(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  return (
    <div className="articleDetailsScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title="View Release Calendar"
            backButton={true}
            backLink={'/release-calendar-management'}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            {isReleaseCalendarDetailsError ? (
              <p className="text-center fs-4 my-4 text-danger">
                {releaseCalendarDetailsError || 'Something went wrong'}
              </p>
            ) : (
              <>
                <div className="row brandDetails my-3">
                  <div className="col-xl-2 order-xl-2 text-end">
                    <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                      <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                        <p className="textLabel">Status:</p>
                        {isReleaseCalendarDetailsLoading ? (
                          <LineSkeleton width="120px" />
                        ) : (
                          <p
                            className={`text-capitalize ${
                              releaseCalendarDetailsData?.is_active == 1
                                ? 'colorGreen'
                                : releaseCalendarDetailsData?.is_active == 2
                                ? 'colorRed'
                                : 'colorYellowDark'
                            }`}
                          >
                            {releaseCalendarDetailsData?.is_active == 1
                              ? 'Active'
                              : releaseCalendarDetailsData?.is_active == 2
                              ? 'Inactive'
                              : 'Pending'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-10 order-xl-1">
                    <div className="row mb-4">
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Calendar Title:</p>
                          {isReleaseCalendarDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {releaseCalendarDetailsData?.calender_title ||
                                'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Brand Name:</p>
                          {isReleaseCalendarDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {releaseCalendarDetailsData?.brand?.name || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Shoe Name:</p>
                          {isReleaseCalendarDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {releaseCalendarDetailsData?.shoe_name || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Shoe Affiliate Link:</p>
                          {isReleaseCalendarDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {releaseCalendarDetailsData?.shoe_affiliate_link ||
                                'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Publish Date:</p>
                          {isReleaseCalendarDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {dateFormat(
                                releaseCalendarDetailsData?.publish_date
                              ) || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Release Date:</p>
                          {isReleaseCalendarDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {dateFormat(
                                releaseCalendarDetailsData?.release_date
                              ) || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12 ">
                        <div className="mb-3">
                          <p className="textLabel">Shoe Image:</p>
                          {isReleaseCalendarDetailsLoading ? (
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
                                  releaseCalendarDetailsData?.shoe_image ||
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
                          text="Edit"
                          variant="secondary"
                          className="w-auto d-inline-block"
                          to={`/release-calendar-management/edit-release-calendar/${id}`}
                          disabled={isReleaseCalendarDetailsLoading}
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

export default ReleaseCalendarDetails;
