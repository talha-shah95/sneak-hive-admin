import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { images } from '../../../assets/images';

import getProfile from './Services/GetProfile';

import PageTitle from '../../../Components/PageTitle';
import CustomCard from '../../../Components/CustomCard';
import CustomButton from '../../../Components/CustomButton';
import LineSkeleton from '../../../Components/SkeletonLoaders/LineSkeleton';

import './style.css';

const Profile = () => {
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => getProfile(),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  return (
    <div className="profileScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle title="My Profile" />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            {isProfileError ? (
              <p className="text-center fs-4 my-4 text-danger">
                {profileError || 'Something went wrong'}
              </p>
            ) : (
              <>
                <div className="row mb-4 profileDetails">
                  <div className="col-12 mb-4">
                    <div className="roundImageWrapper roundImage mt-3">
                      {isProfileLoading ? (
                        <LineSkeleton
                          width="110px"
                          height="110px"
                          borderRadius="99px"
                        />
                      ) : (
                        <img
                          src={
                            profileData?.profile_image ||
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
                  <div className="col-12 col-lg-8 col-xl-6">
                    <div className="row mb-3">
                      <div className="col-6">
                        <p className="textLabel">Name:</p>
                      </div>
                      <div className="col-6">
                        {isProfileLoading ? (
                          <LineSkeleton />
                        ) : (
                          <p className="textValue">
                            {profileData?.first_name || 'N/A'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-6">
                        <p className="textLabel">Last Name:</p>
                      </div>
                      <div className="col-6">
                        {isProfileLoading ? (
                          <LineSkeleton />
                        ) : (
                          <p className="textValue">
                            {profileData?.last_name || 'N/A'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-6">
                        <p className="textLabel">Email:</p>
                      </div>
                      <div className="col-6">
                        {isProfileLoading ? (
                          <LineSkeleton />
                        ) : (
                          <p className="textValue">
                            {profileData?.email || 'N/A'}
                          </p>
                        )}
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
                        variant="secondary"
                        disabled={isProfileLoading}
                      />
                      <CustomButton
                        text="change password"
                        tabIndex={3}
                        to={'/profile/change-password'}
                        variant="secondary"
                        disabled={isProfileLoading}
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
