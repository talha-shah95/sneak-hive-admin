import React from 'react';
import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import GetVideo from './Services/GetVideo';

import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import LineSkeleton from '../../../../Components/SkeletonLoaders/LineSkeleton';
import CustomButton from '../../../../Components/CustomButton';
import { dateFormat } from '../../../../Utils/Utils';

const VideoDetails = () => {
  const { id } = useParams();

  const {
    data: videoDetailsData,
    isLoading: isVideoDetailsLoading,
    isError: isVideoDetailsError,
    error: videoDetailsError,
  } = useQuery({
    queryKey: ['videoDetails', id],
    queryFn: () => GetVideo(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  console.log(videoDetailsData);

  return (
    <div className="videoDetailsScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title="View Unboxing Video"
            backButton={true}
            backLink={'/unboxing-videos-management'}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            {isVideoDetailsError ? (
              <p className="text-center fs-4 my-4 text-danger">
                {videoDetailsError || 'Something went wrong'}
              </p>
            ) : (
              <>
                <div className="row brandDetails my-3">
                  <div className="col-xl-2 order-xl-2 text-end">
                    <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                      <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                        <p className="textLabel">Status:</p>
                        {isVideoDetailsLoading ? (
                          <LineSkeleton width="120px" />
                        ) : (
                          <p
                            className={`text-capitalize ${
                              videoDetailsData?.is_active == 1
                                ? 'colorGreen'
                                : videoDetailsData?.is_active == 2
                                ? 'colorRed'
                                : 'colorYellowDark'
                            }`}
                          >
                            {videoDetailsData?.is_active == 1
                              ? 'Active'
                              : videoDetailsData?.is_active == 2
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
                          <p className="textLabel">Unboxing Video Title:</p>
                          {isVideoDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {videoDetailsData?.title || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Brand:</p>
                          {isVideoDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {videoDetailsData?.brand?.name || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Date of Upload:</p>
                          {isVideoDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {dateFormat(videoDetailsData?.created_at) ||
                                'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Affiliate Link:</p>
                          {isVideoDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {videoDetailsData?.affiliate_link || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <p className="textLabel">Description:</p>
                          {isVideoDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {videoDetailsData?.description || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12 ">
                        <div className="mb-3">
                          <p className="textLabel">Video:</p>
                          {isVideoDetailsLoading ? (
                            <LineSkeleton
                              width="160px"
                              height="160px"
                              borderRadius="10px"
                            />
                          ) : (
                            <div className="videoWrapper">
                              <video
                                className="videoClass"
                                controls
                                src={videoDetailsData?.video}
                                poster={videoDetailsData?.thumbnail}
                              >
                                <source
                                  src={videoDetailsData?.video}
                                  type="video/mp4"
                                />
                                Your browser does not support the video tag.
                              </video>
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
                          to={`/unboxing-videos-management/edit-video/${id}`}
                          disabled={isVideoDetailsLoading}
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

export default VideoDetails;
