import React from 'react';
import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { images } from '../../../../../assets/images';

import GetDocumentDetails from './Services/GetDocumentDetails';

import PageTitle from '../../../../../Components/PageTitle';
import CustomCard from '../../../../../Components/CustomCard';
import LineSkeleton from '../../../../../Components/SkeletonLoaders/LineSkeleton';
import { dateFormat } from '../../../../../Utils/Utils';

const DocumentDetails = () => {
  const { id } = useParams();

  const {
    data: documentDetailsData,
    isLoading: isDocumentDetailsLoading,
    isError: isDocumentDetailsError,
    error: documentDetailsError,
  } = useQuery({
    queryKey: ['documentDetails', id],
    queryFn: () => GetDocumentDetails(),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  return (
    <div className="documentDetailsScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title="View Document Details"
            backButton={true}
            backLink={'/documents-history'}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            {isDocumentDetailsError ? (
              <p className="text-center fs-4 my-4 text-danger">
                {documentDetailsError || 'Something went wrong'}
              </p>
            ) : (
              <>
                <div className="row productDetails my-3">
                  <div className="col-xl-2 order-xl-2 text-end">
                    <div className="d-flex justify-content-end align-items-center gap-2 mb-4">
                      <p className="textLabel">Status:</p>
                      {isDocumentDetailsLoading ? (
                        <LineSkeleton />
                      ) : (
                        <p
                          className={`text-capitalize ${
                            documentDetailsData?.status == 0
                              ? 'colorYellowDark'
                              : document?.status == 1
                              ? 'colorGreen'
                              : 'colorRed'
                          }`}
                        >
                          {documentDetailsData?.status_detail || 'N/A'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-xl-10 order-xl-1">
                    <div className="row mb-4">
                      <div className="col-lg-4">
                        <div className="mb-3">
                          <p className="textLabel">Upload Date:</p>
                          {isDocumentDetailsLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {dateFormat(documentDetailsData?.created_at) || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="mb-3">
                          <p className="textLabel">Verification Date:</p>
                          {isDocumentDetailsLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {dateFormat(documentDetailsData?.verification_date) || '-'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="mb-3">
                          <p className="textLabel">Expiration Date:</p>
                          {isDocumentDetailsLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {dateFormat(documentDetailsData?.expiration_date) || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row mb-4 licenseDetails">
                      <div className="col-12">
                        <h3 className="secondaryTitle mb-4">Liquor License</h3>
                      </div>
                      <div className="col-6 col-md-4">
                        <div className="mb-3">
                          <p className="textLabel">License Number:</p>
                          {isDocumentDetailsLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              #{documentDetailsData?.license_number || ''}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-6 col-md-4">
                        <div className="mb-3">
                          <p className="textLabel">Issued Date:</p>
                          {isDocumentDetailsLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {dateFormat(documentDetailsData?.issued_date) || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-6 col-md-4">
                        <div className="mb-3">
                          <p className="textLabel">Expiration Date:</p>
                          {isDocumentDetailsLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {dateFormat(documentDetailsData?.expiration_date) || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="row">
                          <div className="col-12 col-md-4">
                            <div className="mb-3">
                              <p className="textLabel">License:</p>
                              {isDocumentDetailsLoading ? (
                                <LineSkeleton width="100%" height="160px" />
                              ) : (
                                <div className="squareImageWrapper">
                                  <img
                                    src={
                                      documentDetailsData?.medias?.license
                                        ?.media_path ||
                                      images?.defaultPlaceholder
                                    }
                                    onError={(e) => {
                                      e.target.src = images?.defaultPlaceholder;
                                    }}
                                    className="squareImage"
                                    alt=""
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-4 resaleCertificateDetails">
                      <div className="col-12">
                        <h3 className="secondaryTitle mb-4">
                          Resale Certificate
                        </h3>
                      </div>
                      <div className="col-6 col-md-4">
                        <div className="mb-3">
                          <p className="textLabel">Certificate ID:</p>
                          {isDocumentDetailsLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              #{documentDetailsData?.certificate_id || ''}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="row">
                          <div className="col-12 col-md-4">
                            <div className="mb-3">
                              <p className="textLabel">Certificate:</p>
                              {isDocumentDetailsLoading ? (
                                <LineSkeleton width="100%" height="160px" />
                              ) : (
                                <div className="squareImageWrapper">
                                  <img
                                    src={
                                      documentDetailsData?.medias?.certificate
                                        ?.media_path ||
                                      images?.defaultPlaceholder
                                    }
                                    onError={(e) => {
                                      e.target.src = images?.defaultPlaceholder;
                                    }}
                                    className="squareImage"
                                    alt=""
                                  />
                                </div>
                              )}
                            </div>
                          </div>
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

export default DocumentDetails;
