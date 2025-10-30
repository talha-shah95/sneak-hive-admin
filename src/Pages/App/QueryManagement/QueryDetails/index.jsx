import React from 'react';
import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import GetQuery from './Services/GetQuery';

import { dateFormat } from '../../../../Utils/Utils';

import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import LineSkeleton from '../../../../Components/SkeletonLoaders/LineSkeleton';

const QueryDetails = () => {
  const { id } = useParams();

  const {
    data: queryDetailsData,
    isLoading: isQueryDetailsLoading,
    isError: isQueryDetailsError,
    error: queryDetailsError,
  } = useQuery({
    queryKey: ['queryDetails', id],
    queryFn: () => GetQuery(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  return (
    <div className="queryDetailsScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title="View Query Details"
            backButton={true}
            backLink={'/query-management'}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            {isQueryDetailsError ? (
              <p className="text-center fs-4 my-4 text-danger">
                {queryDetailsError || 'Something went wrong'}
              </p>
            ) : (
              <>
                <div className="row queryDetails my-3">
                  <div className="col-xl-10 order-xl-1">
                    <div className="row mb-4">
                      <div className="col-md-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">User Type:</p>
                          {isQueryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {queryDetailsData?.user_type || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Full Name:</p>
                          {isQueryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {queryDetailsData?.name || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Date:</p>
                          {isQueryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {dateFormat(queryDetailsData?.created_at) ||
                                'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Email Address:</p>
                          {isQueryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {queryDetailsData?.email || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Subject:</p>
                          {isQueryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {queryDetailsData?.subject || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <p className="textLabel">Message:</p>
                          {isQueryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {queryDetailsData?.message || 'N/A'}
                            </p>
                          )}
                        </div>
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

export default QueryDetails;
