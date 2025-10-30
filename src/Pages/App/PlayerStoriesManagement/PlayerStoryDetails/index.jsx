import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import GetPlayerStory from './Services/GetPlayerStory';

import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import LineSkeleton from '../../../../Components/SkeletonLoaders/LineSkeleton';
import CustomButton from '../../../../Components/CustomButton';
import { images } from '../../../../assets/images';

const PlayerStoryDetails = () => {
  const { id } = useParams();

  const {
    data: playerStoryDetailsData,
    isLoading: isPlayerStoryDetailsLoading,
    isError: isPlayerStoryDetailsError,
    error: playerStoryDetailsError,
  } = useQuery({
    queryKey: ['playerStories', 'playerStoryDetails', id],
    queryFn: () => GetPlayerStory(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  console.log(playerStoryDetailsData);

  return (
    <div className="playerStoryDetailsScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title="View Player Story"
            backButton={true}
            backLink={'/player-stories-management'}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            {isPlayerStoryDetailsError ? (
              <p className="text-center fs-4 my-4 text-danger">
                {playerStoryDetailsError || 'Something went wrong'}
              </p>
            ) : (
              <>
                <div className="row brandDetails my-3">
                  <div className="col-xl-2 order-xl-2 text-end">
                    <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                      <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                        <p className="textLabel">Status:</p>
                        {isPlayerStoryDetailsLoading ? (
                          <LineSkeleton width="120px" />
                        ) : (
                          <p
                            className={`text-capitalize ${
                              playerStoryDetailsData?.is_active == 1
                                ? 'colorGreen'
                                : playerStoryDetailsData?.is_active == 0
                                ? 'colorRed'
                                : 'colorYellowDark'
                            }`}
                          >
                            {playerStoryDetailsData?.is_active == 1
                              ? 'Active'
                              : playerStoryDetailsData?.is_active == 0
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
                          <p className="textLabel">Player Story Title:</p>
                          {isPlayerStoryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {playerStoryDetailsData?.story_title || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Category:</p>
                          {isPlayerStoryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {playerStoryDetailsData?.category?.name || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Player Name:</p>
                          {isPlayerStoryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {playerStoryDetailsData?.player_name || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Published By:</p>
                          {isPlayerStoryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {playerStoryDetailsData?.published_by || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Story Link:</p>
                          {isPlayerStoryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <Link
                              to={playerStoryDetailsData?.story_link}
                              target="_blank"
                              className="textValue text-decoration-none"
                            >
                              {playerStoryDetailsData?.story_link || 'N/A'}
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <p className="textLabel">Player Story Detailed:</p>
                          {isPlayerStoryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {playerStoryDetailsData?.story_details || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12 ">
                        <div className="mb-3">
                          <p className="textLabel">Player Story Cover:</p>
                          {isPlayerStoryDetailsLoading ? (
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
                                  playerStoryDetailsData?.cover ||
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
                          to={`/player-stories-management/edit-player-story/${id}`}
                          disabled={isPlayerStoryDetailsLoading}
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

export default PlayerStoryDetails;
