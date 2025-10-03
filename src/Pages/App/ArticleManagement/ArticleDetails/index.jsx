import React from 'react';
import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import GetArticle from './Services/GetArticle';

import { images } from '../../../../assets/images';

import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import LineSkeleton from '../../../../Components/SkeletonLoaders/LineSkeleton';
import CustomButton from '../../../../Components/CustomButton';

const ArticleDetails = () => {
  const { id } = useParams();

  const {
    data: articleDetailsData,
    isLoading: isArticleDetailsLoading,
    isError: isArticleDetailsError,
    error: articleDetailsError,
  } = useQuery({
    queryKey: ['articleDetails', id],
    queryFn: () => GetArticle(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  console.log(articleDetailsData);

  return (
    <div className="articleDetailsScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title="View Article"
            backButton={true}
            backLink={'/article-management'}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            {isArticleDetailsError ? (
              <p className="text-center fs-4 my-4 text-danger">
                {articleDetailsError || 'Something went wrong'}
              </p>
            ) : (
              <>
                <div className="row brandDetails my-3">
                  <div className="col-xl-2 order-xl-2 text-end">
                    <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                      <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                        <p className="textLabel">Status:</p>
                        {isArticleDetailsLoading ? (
                          <LineSkeleton width="120px" />
                        ) : (
                          <p
                            className={`text-capitalize ${
                              articleDetailsData?.is_active == 1
                                ? 'colorGreen'
                                : articleDetailsData?.is_active == 2
                                ? 'colorRed'
                                : 'colorYellowDark'
                            }`}
                          >
                            {articleDetailsData?.is_active == 1
                              ? 'Active'
                              : articleDetailsData?.is_active == 2
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
                          <p className="textLabel">Article Title:</p>
                          {isArticleDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {articleDetailsData?.title || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Category:</p>
                          {isArticleDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {articleDetailsData?.category?.name || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Published By:</p>
                          {isArticleDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {articleDetailsData?.published_by || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Story Link:</p>
                          {isArticleDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {articleDetailsData?.link || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <p className="textLabel">Article Detailed:</p>
                          {isArticleDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {articleDetailsData?.details || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12 ">
                        <div className="mb-3">
                          <p className="textLabel">Article Cover:</p>
                          {isArticleDetailsLoading ? (
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
                                  articleDetailsData?.cover ||
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
                          to={`/article-management/edit-article/${id}`}
                          disabled={isArticleDetailsLoading}
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

export default ArticleDetails;
