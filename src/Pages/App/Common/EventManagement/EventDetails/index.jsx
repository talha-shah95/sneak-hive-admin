import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import GetEventDetails from './Services/GetEventDetails';

import { dateFormat } from '../../../../../Utils/Utils';

import PageTitle from '../../../../../Components/PageTitle';
import CustomCard from '../../../../../Components/CustomCard';
import CustomButton from '../../../../../Components/CustomButton';
import LineSkeleton from '../../../../../Components/SkeletonLoaders/LineSkeleton';

const EventDetails = () => {
  const { id } = useParams();

  const {
    data: eventDetailsData,
    isLoading: isEventDetailsLoading,
    isError: isEventDetailsError,
    error: eventDetailsError,
  } = useQuery({
    queryKey: ['eventDetails', id],
    queryFn: () => GetEventDetails(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  const handleStartSession = () => {
    console.log('Start Session');
  };

  return (
    <div className="eventDetailsScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title="View Event Details "
            backButton={true}
            backLink={'/event-management'}
          />
        </div>
        <div className="col-12 col-xl-6 text-end">
          <CustomButton
            text="Event Enrollment Logs"
            to={`/event-management/event-enrollment-logs/${id}`}
            className="w-auto d-inline-block"
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            {isEventDetailsError ? (
              <p className="text-center fs-4 my-4 text-danger">
                {eventDetailsError || 'Something went wrong'}
              </p>
            ) : (
              <>
                <div className="row eventDetails my-3">
                  <div className="col-xl-10 order-xl-1">
                    <div className="row mb-4">
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <p className="textLabel">Event Name:</p>
                          {isEventDetailsLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {eventDetailsData?.name || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <p className="textLabel">Description:</p>
                          {isEventDetailsLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {`${eventDetailsData?.description}`}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <p className="textLabel">Event Type:</p>
                          {isEventDetailsLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {eventDetailsData?.type || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      {(eventDetailsData?.type == 'Online' ||
                        eventDetailsData?.type == 'Hybrid') && (
                        <>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <p className="textLabel">Online Session Link:</p>
                              {isEventDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  <Link
                                    to={eventDetailsData?.online_session_link}
                                    target="_blank"
                                  >
                                    {eventDetailsData?.online_session_link ||
                                      'N/A'}
                                  </Link>
                                </p>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                      {(eventDetailsData?.type == 'Onsite' ||
                        eventDetailsData?.type == 'Hybrid') && (
                        <>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <p className="textLabel">Location:</p>
                              {isEventDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  {eventDetailsData?.location || 'N/A'}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <p className="textLabel">Map Link:</p>
                              {isEventDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  <Link
                                    to={eventDetailsData?.map_link}
                                    target="_blank"
                                  >
                                    {eventDetailsData?.map_link || 'N/A'}
                                  </Link>
                                </p>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <p className="textLabel">Enrollment Price:</p>
                          {isEventDetailsLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              ${eventDetailsData?.enrollment_price || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <p className="textLabel">Event Date:</p>
                          {isEventDetailsLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {dateFormat(eventDetailsData?.event_date) ||
                                'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <p className="textLabel">Event Time:</p>
                          {isEventDetailsLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {`${eventDetailsData?.start_time} To ${eventDetailsData?.end_time}`}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {eventDetailsData?.includes_alcohol == '1' && (
                      <div className="row mb-4">
                        <div className="col-12">
                          <p className="secondaryTitle mb-3">
                            This event includes the service of alcoholic
                            beverages.
                          </p>
                        </div>
                        <div className="col-12">
                          <p className="textLabel">Legal Age:</p>
                          {isEventDetailsLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {eventDetailsData?.legal_age || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="d-flex align-items-center gap-3">
                      {(eventDetailsData?.type == 'Online' ||
                        eventDetailsData?.type == 'Hybrid') && (
                        <CustomButton
                          text="Start Session"
                          onClick={handleStartSession}
                          loading={isEventDetailsLoading}
                        />
                      )}
                      <CustomButton
                        text="Edit Event"
                        variant={
                          eventDetailsData?.type == 'Onsite'
                            ? 'primary'
                            : 'secondary'
                        }
                        to={`/event-management/edit-event/${id}`}
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

export default EventDetails;
