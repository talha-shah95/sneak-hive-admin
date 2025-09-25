import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { images } from '../../../../assets/images';

import getVendorProfile from './Services/GetVendorProfile';

import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomButton from '../../../../Components/CustomButton';
import LineSkeleton from '../../../../Components/SkeletonLoaders/LineSkeleton';

import './style.css';

const Profile = () => {
  const {
    data: vendorProfileData,
    isLoading: isVendorProfileLoading,
    isError: isVendorProfileError,
    error: vendorProfileError,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => getVendorProfile(),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  return (
    <div className="profileScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle title="Profile" />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            {isVendorProfileError ? (
              <p className="text-center fs-4 my-4 text-danger">
                {vendorProfileError || 'Something went wrong'}
              </p>
            ) : (
              <>
                <div className="row mb-4 profileDetails">
                  <div className="col-12">
                    <h3 className="secondaryTitle">Profile Details</h3>
                  </div>

                  <div className="col-12">
                    <div className="roundImageWrapper roundImage mt-3">
                      {isVendorProfileLoading ? (
                        <LineSkeleton
                          width="110px"
                          height="110px"
                          borderRadius="99px"
                        />
                      ) : (
                        <img
                          src={
                            vendorProfileData?.profile_image ||
                            images?.userPlaceholder
                          }
                          onError={(e) => {
                            e.target.src = images?.userPlaceholder;
                          }}
                          alt="Profile"
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-xl-10">
                    <div className="row mt-4">
                      <div className="col-6 col-md-4">
                        <div className="mb-3">
                          <p className="textLabel">Name:</p>
                          {isVendorProfileLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {vendorProfileData?.first_name || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-6 col-md-4">
                        <div className="mb-3">
                          <p className="textLabel">Last Name:</p>
                          {isVendorProfileLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {vendorProfileData?.last_name || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-6 col-md-4">
                        <div className="mb-3">
                          <p className="textLabel">Email:</p>
                          {isVendorProfileLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {vendorProfileData?.email || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-6 col-md-4">
                        <div className="mb-3">
                          <p className="textLabel">Phone No:</p>
                          {isVendorProfileLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {vendorProfileData?.phone || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-6 col-md-4">
                        <div className="mb-3">
                          <p className="textLabel">Commission Rate:</p>
                          {isVendorProfileLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {vendorProfileData?.business_profile
                                ?.commission_rate
                                ? `${vendorProfileData?.business_profile?.commission_rate}%`
                                : 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mb-4 businessDetails">
                  <div className="col-12">
                    <h3 className="secondaryTitle">Business Profile Details</h3>
                  </div>
                  <div className="col-12">
                    <div className="roundImageWrapper roundImage mt-3">
                      {isVendorProfileLoading ? (
                        <LineSkeleton
                          width="110px"
                          height="110px"
                          borderRadius="99px"
                        />
                      ) : (
                        <img
                          src={
                            vendorProfileData?.business_profile
                              ?.profile_image || images?.userPlaceholder
                          }
                          onError={(e) => {
                            e.target.src = images?.userPlaceholder;
                          }}
                          alt="Profile"
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-xl-10">
                    <div className="row mt-4">
                      <div className="col-6 col-md-4">
                        <div className="mb-3">
                          <p className="textLabel">Business Name:</p>
                          {isVendorProfileLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {vendorProfileData?.business_profile?.name ||
                                'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-6 col-md-4">
                        <div className="mb-3">
                          <p className="textLabel">Business Category:</p>
                          {isVendorProfileLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {vendorProfileData?.business_profile
                                ?.category_id || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-6 col-md-4">
                        <div className="mb-3">
                          <p className="textLabel">Business Type:</p>
                          {isVendorProfileLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {vendorProfileData?.business_profile?.type_id ||
                                'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-6 col-md-4">
                        <div className="mb-3">
                          <p className="textLabel">Country:</p>
                          {isVendorProfileLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {vendorProfileData?.business_profile?.country ||
                                'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-6 col-md-4">
                        <div className="mb-3">
                          <p className="textLabel">State:</p>
                          {isVendorProfileLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {vendorProfileData?.business_profile?.state ||
                                'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mb-4 businessTaxDetails">
                  <div className="col-12">
                    <h3 className="secondaryTitle">
                      Business Tax ID (EIN / VAT ID):
                    </h3>
                  </div>
                  <div className="col-12 col-xl-10">
                    <div className="row mt-4">
                      <div className="col-6 col-md-4">
                        <div className="mb-3">
                          <p className="textLabel">EIN:</p>
                          {isVendorProfileLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {vendorProfileData?.business_profile?.ein ||
                                'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-6 col-md-4">
                        <div className="mb-3">
                          <p className="textLabel">VAT ID:</p>
                          {isVendorProfileLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {vendorProfileData?.business_profile?.vat_id ||
                                'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-6 col-md-4">
                        <div className="mb-3">
                          <p className="textLabel">Referral Code Usage:</p>
                          {isVendorProfileLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {vendorProfileData?.business_profile
                                ?.referral_code == '0'
                                ? 'Disabled'
                                : 'Enabled'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="d-flex align-items-center gap-3">
                      <CustomButton
                        text="edit profile"
                        tabIndex={3}
                        to={'/profile/edit'}
                        disabled={isVendorProfileLoading}
                      />
                      <CustomButton
                        text="change password"
                        tabIndex={3}
                        to={'/profile/change-password'}
                        className="secondaryButton"
                        disabled={isVendorProfileLoading}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </CustomCard>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard title="Alcohol Sales Compliance Documents">
            {isVendorProfileError ? (
              <p className="text-center fs-4 my-4 text-danger">
                {vendorProfileError || 'Something went wrong'}
              </p>
            ) : (
              <>
                <div className="row mb-4 mt-4 licenseDetails">
                  <div className="col-12">
                    <h3 className="secondaryTitle">Liquor License</h3>
                  </div>
                  <div className="col-12 col-xl-10">
                    <div className="row mt-4">
                      <div className="col-6 col-md-4">
                        <div className="mb-3">
                          <p className="textLabel">License Number:</p>
                          {isVendorProfileLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {vendorProfileData?.business_profile?.license
                                ?.license_number || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-6 col-md-4">
                        <div className="mb-3">
                          <p className="textLabel">Issued Date:</p>
                          {isVendorProfileLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {vendorProfileData?.business_profile?.license
                                ?.issued_date || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-6 col-md-4">
                        <div className="mb-3">
                          <p className="textLabel">Expiration Date:</p>
                          {isVendorProfileLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {vendorProfileData?.business_profile?.license
                                ?.expiration_date || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="row">
                          <div className="col-12 col-md-4">
                            <div className="mb-3">
                              <p className="textLabel">License Image:</p>
                              {isVendorProfileLoading ? (
                                <LineSkeleton width="100%" height="160px" />
                              ) : (
                                <div className="squareImageWrapper">
                                  <img
                                    src={
                                      vendorProfileData?.business_profile
                                        ?.license?.medias?.license
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
                <div className="row mb-4 mt-4 resaleDetails">
                  <div className="col-12">
                    <h3 className="secondaryTitle">Resale Certificate</h3>
                  </div>
                  <div className="col-12 col-xl-10">
                    <div className="row mt-4">
                      <div className="col-6 col-md-4">
                        <div className="mb-3">
                          <p className="textLabel">Certificate ID:</p>
                          {isVendorProfileLoading ? (
                            <LineSkeleton />
                          ) : (
                            <p className="textValue">
                              {vendorProfileData?.business_profile
                                ?.certificate_id || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="row">
                          <div className="col-12 col-md-4">
                            <div className="mb-3">
                              <p className="textLabel">Certificate:</p>
                              {isVendorProfileLoading ? (
                                <LineSkeleton width="100%" height="160px" />
                              ) : (
                                <div className="squareImageWrapper">
                                  <img
                                    src={
                                      vendorProfileData?.business_profile
                                        ?.license?.medias?.certificate
                                        ?.media_path ||
                                      images?.defaultPlaceholder
                                    }
                                    className="squareImage"
                                    alt=""
                                    onError={(e) => {
                                      e.target.src = images?.defaultPlaceholder;
                                    }}
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
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="d-flex align-items-center gap-3">
                      <CustomButton
                        text="view Document History"
                        tabIndex={3}
                        to={'/documents-history'}
                        disabled={isVendorProfileLoading}
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

export default Profile;
