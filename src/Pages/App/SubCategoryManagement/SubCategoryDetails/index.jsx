import React from 'react';
import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import GetSubCategory from './Services/GetSubCategory';

import { categoryShowIn } from '../Constants';

import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import LineSkeleton from '../../../../Components/SkeletonLoaders/LineSkeleton';
import CustomButton from '../../../../Components/CustomButton';

const SubCategoryDetails = () => {
  const { id } = useParams();

  const {
    data: subCategoryDetailsData,
    isLoading: isSubCategoryDetailsLoading,
    isError: isSubCategoryDetailsError,
    error: subCategoryDetailsError,
  } = useQuery({
    queryKey: ['subCategories', 'subCategoryDetails', id],
    queryFn: () => GetSubCategory(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  const getCategoryShowInLabel = (value) => {
    return categoryShowIn.find((item) => item.value == value)?.label;
  };

  return (
    <div className="subCategoryDetailsScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title="View Sub Category Details"
            backButton={true}
            backLink={'/sub-category-management'}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            {isSubCategoryDetailsError ? (
              <p className="text-center fs-4 my-4 text-danger">
                {subCategoryDetailsError || 'Something went wrong'}
              </p>
            ) : (
              <>
                <div className="row brandDetails my-3">
                  <div className="col-xl-2 order-xl-2 text-end">
                    <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                      <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                        <p className="textLabel">Status:</p>
                        {isSubCategoryDetailsLoading ? (
                          <LineSkeleton width="120px" />
                        ) : (
                          <p
                            className={`text-capitalize ${
                              subCategoryDetailsData?.is_active == 1
                                ? 'colorGreen'
                                : subCategoryDetailsData?.is_active == 0
                                ? 'colorRed'
                                : 'colorYellowDark'
                            }`}
                          >
                            {subCategoryDetailsData?.is_active == 1
                              ? 'Active'
                              : subCategoryDetailsData?.is_active == 0
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
                          <p className="textLabel">Category:</p>
                          {isSubCategoryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {subCategoryDetailsData?.name || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <p className="textLabel">Show Category in:</p>
                          {isSubCategoryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {getCategoryShowInLabel(
                                subCategoryDetailsData?.show
                              ) || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <p className="textLabel">Parent Category:</p>
                          {isSubCategoryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {subCategoryDetailsData?.category?.name || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <p className="textLabel">Total Products:</p>
                          {isSubCategoryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {subCategoryDetailsData?.products_count || '0'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <CustomButton
                          text="Edit Sub Category"
                          variant="secondary"
                          className="w-auto d-inline-block"
                          to={`/sub-category-management/edit-sub-category/${id}`}
                          disabled={isSubCategoryDetailsLoading}
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

export default SubCategoryDetails;
