import React from 'react';
import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import GetBlog from './Services/GetBlog';

import { images } from '../../../../assets/images';

import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import LineSkeleton from '../../../../Components/SkeletonLoaders/LineSkeleton';
import CustomButton from '../../../../Components/CustomButton';
import { dateFormat } from '../../../../Utils/Utils';
import { FaComments } from 'react-icons/fa';
import { AiFillLike } from 'react-icons/ai';

const BlogDetails = () => {
  const { id } = useParams();

  const {
    data: blogDetailsData,
    isLoading: isBlogDetailsLoading,
    isError: isBlogDetailsError,
    error: blogDetailsError,
  } = useQuery({
    queryKey: ['blogDetails', id],
    queryFn: () => GetBlog(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  console.log(blogDetailsData);

  return (
    <div className="blogDetailsScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title="View Blog"
            backButton={true}
            backLink={'/blogs-management'}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            {isBlogDetailsError ? (
              <p className="text-center fs-4 my-4 text-danger">
                {blogDetailsError || 'Something went wrong'}
              </p>
            ) : (
              <>
                <div className="row brandDetails my-3">
                  <div className="col-xl-2 order-xl-2 text-end">
                    <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                      <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                        <p className="textLabel">Status:</p>
                        {isBlogDetailsLoading ? (
                          <LineSkeleton width="120px" />
                        ) : (
                          <p
                            className={`text-capitalize ${
                              blogDetailsData?.is_active == 1
                                ? 'colorGreen'
                                : blogDetailsData?.is_active == 2
                                ? 'colorRed'
                                : 'colorYellowDark'
                            }`}
                          >
                            {blogDetailsData?.is_active == 1
                              ? 'Active'
                              : blogDetailsData?.is_active == 2
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
                          <p className="textLabel">Blog Title:</p>
                          {isBlogDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {blogDetailsData?.title || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Linked Product:</p>
                          {isBlogDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {blogDetailsData?.product?.name || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Upload Date:</p>
                          {isBlogDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {dateFormat(blogDetailsData?.created_at) || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Reactions Count:</p>
                          {isBlogDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {blogDetailsData?.reactions_count || '0'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Comments Count:</p>
                          {isBlogDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {blogDetailsData?.comments_count || '0'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <p className="textLabel">Blog Caption:</p>
                          {isBlogDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {blogDetailsData?.caption || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12 ">
                        <div className="mb-3">
                          <p className="textLabel">Blog Cover:</p>
                          {isBlogDetailsLoading ? (
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
                                  blogDetailsData?.content ||
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
                          to={`/blogs-management/edit-blog/${id}`}
                          disabled={isBlogDetailsLoading}
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

export default BlogDetails;
