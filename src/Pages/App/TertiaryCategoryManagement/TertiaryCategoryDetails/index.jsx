import React from 'react';
import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import GetTertiaryCategoryDetails from './Services/GetTertiaryCategoryDetails';

import { dateFormat } from '../../../../Utils/Utils';

// import { categoryShowIn } from '../Constants';

import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import LineSkeleton from '../../../../Components/SkeletonLoaders/LineSkeleton';
import CustomButton from '../../../../Components/CustomButton';

  const TertiaryCategoryDetails = () => {
  const { id } = useParams();

  const {
    data: tertiaryCategoryDetailsData,
    isLoading: isTertiaryCategoryDetailsLoading,
    isError: isTertiaryCategoryDetailsError,
    error: tertiaryCategoryDetailsError,
  } = useQuery({
    queryKey: ['tertiaryCategories', 'tertiaryCategoryDetails', id],
    queryFn: () => GetTertiaryCategoryDetails(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  // const getCategoryShowInLabel = (value) => {
  //   return categoryShowIn.find((item) => item.value == value)?.label;
  // };

  return (
    <div className="tertiaryCategoryDetailsScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title="View Tertiary Category Details"
            backButton={true}
            backLink={'/tertiary-category-management'}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            {isTertiaryCategoryDetailsError ? (
              <p className="text-center fs-4 my-4 text-danger">
                {tertiaryCategoryDetailsError || 'Something went wrong'}
              </p>
            ) : (
              <>
                <div className="row brandDetails my-3">
                  <div className="col-xl-2 order-xl-2 text-end">
                    <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                      <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                        <p className="textLabel">Status:</p>
                        {isTertiaryCategoryDetailsLoading ? (
                          <LineSkeleton width="120px" />
                        ) : (
                          <p
                            className={`text-capitalize ${
                              tertiaryCategoryDetailsData?.is_active == 1
                                ? 'colorGreen'
                                : tertiaryCategoryDetailsData?.is_active == 0
                                ? 'colorRed'
                                : 'colorYellowDark'
                            }`}
                          >
                            {tertiaryCategoryDetailsData?.is_active == 1
                              ? 'Active'
                              : tertiaryCategoryDetailsData?.is_active == 0
                              ? 'Inactive'
                              : 'Pending'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-10 order-xl-1">
                    <div className="row mb-4">
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <p className="textLabel">Tertiary Category:</p>
                          {isTertiaryCategoryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {tertiaryCategoryDetailsData?.name || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <p className="textLabel">Sub Category:</p>
                          {isTertiaryCategoryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {tertiaryCategoryDetailsData?.sub_category?.name || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <p className="textLabel">Total Products:</p>
                          {isTertiaryCategoryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {tertiaryCategoryDetailsData?.products_count || '0'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <p className="textLabel">Added On:</p>
                          {isTertiaryCategoryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {dateFormat(tertiaryCategoryDetailsData?.created_at) || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <CustomButton
                          text="Edit Tertiary Category"
                          variant="secondary"
                          className="w-auto d-inline-block"
                          to={`/tertiary-category-management/edit-tertiary-category/${id}`}
                          disabled={isTertiaryCategoryDetailsLoading}
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

export default TertiaryCategoryDetails;
