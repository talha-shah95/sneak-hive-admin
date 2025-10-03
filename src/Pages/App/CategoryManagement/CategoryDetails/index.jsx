import React from 'react';
import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import GetCategory from './Services/GetCategory';

import { categoryShowIn } from '../Constants';

import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import LineSkeleton from '../../../../Components/SkeletonLoaders/LineSkeleton';
import CustomButton from '../../../../Components/CustomButton';

const CategoryDetails = () => {
  const { id } = useParams();

  const {
    data: categoryDetailsData,
    isLoading: isCategoryDetailsLoading,
    isError: isCategoryDetailsError,
    error: categoryDetailsError,
  } = useQuery({
    queryKey: ['categoryDetails', id],
    queryFn: () => GetCategory(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  const getCategoryShowInLabel = (value) => {
    return categoryShowIn.find((item) => item.value == value)?.label;
  };

  return (
    <div className="categoryDetailsScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title="View Category Details"
            backButton={true}
            backLink={'/category-management'}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            {isCategoryDetailsError ? (
              <p className="text-center fs-4 my-4 text-danger">
                {categoryDetailsError || 'Something went wrong'}
              </p>
            ) : (
              <>
                <div className="row brandDetails my-3">
                  <div className="col-xl-2 order-xl-2 text-end">
                    <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                      <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                        <p className="textLabel">Status:</p>
                        {isCategoryDetailsLoading ? (
                          <LineSkeleton width="120px" />
                        ) : (
                          <p
                            className={`text-capitalize ${
                              categoryDetailsData?.is_active == 1
                                ? 'colorGreen'
                                : categoryDetailsData?.is_active == 2
                                ? 'colorRed'
                                : 'colorYellowDark'
                            }`}
                          >
                            {categoryDetailsData?.is_active == 1
                              ? 'Active'
                              : categoryDetailsData?.is_active == 2
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
                          {isCategoryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {categoryDetailsData?.name || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <p className="textLabel">Show Category in:</p>
                          {isCategoryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {getCategoryShowInLabel(
                                categoryDetailsData?.show
                              ) || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <p className="textLabel">Sub Categories:</p>
                          {isCategoryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {categoryDetailsData?.sub_categories_count || '0'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <p className="textLabel">Total Products:</p>
                          {isCategoryDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {categoryDetailsData?.products_count || '0'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <CustomButton
                          text="Edit Category"
                          variant="secondary"
                          className="w-auto d-inline-block"
                          to={`/category-management/edit-category/${id}`}
                          disabled={isCategoryDetailsLoading}
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

export default CategoryDetails;
