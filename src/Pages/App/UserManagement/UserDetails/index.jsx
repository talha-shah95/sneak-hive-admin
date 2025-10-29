import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import useModalStore from '../../../../Store/ModalStore';
import { dateFormat } from '../../../../Utils/Utils';
import { images } from '../../../../assets/images';

import GetUserDetails from './Services/GetUserDetails';
import ChangeUserStatus from '../Services/ChangeUserStatus';

import { showToast } from '../../../../Components/CustomToast';
import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomButton from '../../../../Components/CustomButton';
import LineSkeleton from '../../../../Components/SkeletonLoaders/LineSkeleton';

const UserDetails = () => {
  const { id } = useParams();
  const { showModal, closeModal } = useModalStore();
  const queryClient = useQueryClient();
  const {
    data: userDetailsData,
    isLoading: isUserDetailsLoading,
    isError: isUserDetailsError,
    error: userDetailsError,
  } = useQuery({
    queryKey: ['users', 'userDetails', id],
    queryFn: () => GetUserDetails(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  const { mutateAsync: changeStatusMutation } = useMutation({
    mutationFn: (id) => ChangeUserStatus(id),
    onSuccess: ({ message }) => {
      showModal({
        type: 'success',
        showSuccessToast: false,
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message: message || 'User status changed successfully!',
          continueText: 'Ok',
          onContinue: () => {
            closeModal();
          },
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['users', 'userDetails', id],
      });
      queryClient.invalidateQueries({
        queryKey: [
          'users',
          {
            pagination: { page: 1, per_page: 10 },
            filters: { status: '' },
          },
        ],
      });
    },
    onError: (error) => {
      showToast(error?.message || 'Status change failed', 'error');
    },
  });

  const handleChangeStatus = (id, status) => {
    const title = status == 1 ? 'Inactivate User?' : 'Activate User?';
    const message =
      status == 1
        ? 'Are you sure you want to inactivate the User?'
        : 'Are you sure you want to activate the User?';
    showModal({
      type: 'question',
      modalProps: {
        title: title,
        message: message,
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          await changeStatusMutation(id);
        },
      },
    });
  };

  return (
    <div className="userDetailsScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title="View User Details"
            backButton={true}
            backLink={'/user-management'}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            <div className="my-3">
              {isUserDetailsError ? (
                <p className="text-center fs-4 my-4 text-danger">
                  {userDetailsError || 'Something went wrong'}
                </p>
              ) : (
                <>
                  <div className="row mb-4 userDetails">
                    <div className="col-xl-2 order-xl-2 text-end">
                      <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                        <p className="textLabel">Status:</p>
                        {isUserDetailsLoading ? (
                          <LineSkeleton />
                        ) : (
                          <p
                            className={`text-capitalize ${
                              userDetailsData?.is_active == 0
                                ? 'colorRed'
                                : userDetailsData?.is_active == 1
                                ? 'colorGreen'
                                : 'colorYellowDark'
                            }`}
                          >
                            {userDetailsData?.is_active == 1
                              ? 'Active'
                              : 'Inactive'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-10 order-xl-1">
                      <div className="row">
                        <div className="col-12 mb-4">
                          <div className="roundImageWrapper roundImage mt-3">
                            {isUserDetailsLoading ? (
                              <LineSkeleton
                                width="110px"
                                height="110px"
                                borderRadius="99px"
                              />
                            ) : (
                              <img
                                src={
                                  userDetailsData?.profile_image ||
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
                              <p className="textLabel">First Name:</p>
                            </div>
                            <div className="col-6">
                              {isUserDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  {userDetailsData?.first_name || 'N/A'}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="row mb-3">
                            <div className="col-6">
                              <p className="textLabel">Last Name:</p>
                            </div>
                            <div className="col-6">
                              {isUserDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  {userDetailsData?.last_name || 'N/A'}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="row mb-3">
                            <div className="col-6">
                              <p className="textLabel">Email:</p>
                            </div>
                            <div className="col-6">
                              {isUserDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  {userDetailsData?.email || 'N/A'}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="row mb-3">
                            <div className="col-6">
                              <p className="textLabel">Phone:</p>
                            </div>
                            <div className="col-6">
                              {isUserDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  {userDetailsData?.phone || 'N/A'}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="row mb-3">
                            <div className="col-6">
                              <p className="textLabel">Date of Birth:</p>
                            </div>
                            <div className="col-6">
                              {isUserDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  {dateFormat(userDetailsData?.date_of_birth) ||
                                    'N/A'}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="row mb-3">
                            <div className="col-6">
                              <p className="textLabel">Country:</p>
                            </div>
                            <div className="col-6">
                              {isUserDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  {userDetailsData?.country || 'N/A'}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="row mb-3">
                            <div className="col-6">
                              <p className="textLabel">Gender:</p>
                            </div>
                            <div className="col-6">
                              {isUserDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  {userDetailsData?.gender || 'N/A'}
                                </p>
                              )}
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
                          text={
                            userDetailsData?.is_active == 1
                              ? 'Mark as Inactive'
                              : 'Mark as Active'
                          }
                          tabIndex={3}
                          variant="secondaryOrange"
                          disabled={isUserDetailsLoading}
                          onClick={() => {
                            handleChangeStatus(id, userDetailsData?.is_active);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CustomCard>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
