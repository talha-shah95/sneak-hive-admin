import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { dateFormat } from '../../../../../Utils/Utils';
import useModalStore from '../../../../../Store/ModalStore';
import { images } from '../../../../../assets/images';

import GetKegRentalDetails from './Services/GetKegRentalDetails';
import ChangeOrderStatus from './Services/ChangeKegRentalStatus';

import { showToast } from '../../../../../Components/CustomToast';
import PageTitle from '../../../../../Components/PageTitle';
import CustomCard from '../../../../../Components/CustomCard';
import CustomButton from '../../../../../Components/CustomButton';
import LineSkeleton from '../../../../../Components/SkeletonLoaders/LineSkeleton';
import StatusDropdown from '../../../../../Components/StatisDropdown';
import CustomTable from '../../../../../Components/CustomTable';
import CustomInput from '../../../../../Components/CustomInput';

const headers = [
  { id: 1, key: 'sNo', title: 'S.No' },
  { id: 2, key: 'item', title: 'Item' },
  { id: 3, key: 'price', title: 'Price' },
  { id: 4, key: 'deposit', title: 'Deposit' },
  { id: 5, key: 'quantity', title: 'Quantity' },
  { id: 6, key: 'total', title: 'Total' },
];

const KegRentalDetails = () => {
  const { id } = useParams();
  const { showModal, closeModal } = useModalStore();
  const queryClient = useQueryClient();

  const {
    data: kegRentalDetailsData,
    isLoading: isKegRentalDetailsLoading,
    isError: isKegRentalDetailsError,
    error: kegRentalDetailsError,
  } = useQuery({
    queryKey: ['kegRentalDetails', id],
    queryFn: () => GetKegRentalDetails(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  const { mutateAsync: returnedOrderMutation } = useMutation({
    mutationFn: (data) => ChangeOrderStatus(data),
    onSuccess: ({ message }) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message: message || 'Order has been marked as returned successfully!',
          continueText: 'Okay',
          onContinue: () => {
            queryClient.invalidateQueries({
              queryKey: ['kegRentalDetails', 'kegRental'],
            });
            closeModal();
          },
        },
      });
    },
    onError: (error) => {
      showToast(error?.message || 'Status change failed', 'error');
    },
  });

  const { mutateAsync: NoReturnedOrderMutation } = useMutation({
    mutationFn: (id, payload) => ChangeOrderStatus(id, payload),
    onSuccess: ({ message }) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message:
            message || 'Order has been marked as not returned successfully!',
          continueText: 'Okay',
          onContinue: () => {
            queryClient.invalidateQueries({
              queryKey: ['kegRentalDetails', 'kegRental'],
            });
            closeModal();
          },
        },
      });
    },
    onError: (error) => {
      showToast(error?.message || 'Status change failed', 'error');
    },
  });

  const handleMarkAsReturned = (id) => {
    showModal({
      type: 'question',
      modalProps: {
        title: 'Mark as Returned',
        message: 'Are you sure you want to mark the order as returned?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          await returnedOrderMutation({ id, payload: { status: 1 } });
          closeModal();
        },
      },
    });
  };

  const handleMarkAsNotReturned = (id) => {
    showModal({
      type: 'question',
      modalProps: {
        title: 'Mark as Not Returned',
        message: 'Are you sure you want to mark the order as not returned?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          await NoReturnedOrderMutation({ id, payload: { status: 2 } });
          closeModal();
        },
      },
    });
  };

  return (
    <div className="kegRentalDetailsScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title="Keg Order Details"
            backButton={true}
            backLink={'/keg-rental-management'}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            {isKegRentalDetailsError ? (
              <p className="text-center fs-4 my-4 text-danger">
                {kegRentalDetailsError || 'Something went wrong'}
              </p>
            ) : (
              <div className="my-3">
                <div className="orderDetails row mb-4">
                  <div className="col-xl-2 order-xl-2 text-end">
                    <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                      <p className="textLabel">Status:</p>
                      {isKegRentalDetailsLoading ? (
                        <LineSkeleton width="120px" />
                      ) : (
                        <p
                          className={`text-capitalize ${
                            kegRentalDetailsData?.status == 0
                              ? 'colorYellowDark'
                              : kegRentalDetailsData?.status == 1
                              ? 'colorGreen'
                              : 'colorRed'
                          }`}
                        >
                          {kegRentalDetailsData?.status_detail || 'N/A'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-xl-10 order-xl-1">
                    <div className="row ">
                      <div className="col-6 col-lg-3">
                        <div className="mb-3">
                          <p className="textLabel">Order ID:</p>
                          {isKegRentalDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              #{kegRentalDetailsData?.id || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-6 col-lg-3">
                        <div className="mb-3">
                          <p className="textLabel">Order Date:</p>
                          {isKegRentalDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {dateFormat(kegRentalDetailsData?.created_at) ||
                                '-'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-6 col-lg-3">
                        <div className="mb-3">
                          <p className="textLabel">Keg Rental Duration:</p>
                          {isKegRentalDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {kegRentalDetailsData?.keg_rental_duration || '-'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-6 col-lg-3">
                        <div className="mb-3">
                          <p className="textLabel">Time Left:</p>
                          {isKegRentalDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {kegRentalDetailsData?.time_left || '-'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {kegRentalDetailsData?.status == 0 && (
                      <div className="row mt-4">
                        <div className="col-12">
                          <div className="d-flex align-items-center gap-2">
                            <CustomButton
                              text="MArk As Returned"
                              onClick={() => handleMarkAsReturned(id)}
                            />
                            <CustomButton
                              text="Mark as not Returned"
                              onClick={() => handleMarkAsNotReturned(id)}
                              variant="secondary"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="orderItems row mb-4">
                  <div className="col-12">
                    <CustomTable
                      headers={headers}
                      loading={isKegRentalDetailsLoading}
                      rows={kegRentalDetailsData?.order?.order_items?.length}
                    >
                      <tbody>
                        {isKegRentalDetailsError ||
                          (kegRentalDetailsData?.order?.order_items?.length ==
                            0 && (
                            <tr>
                              <td
                                colSpan={headers?.length}
                                className="text-center"
                              >
                                {kegRentalDetailsError?.message ||
                                  'No data found'}
                              </td>
                            </tr>
                          ))}
                        {kegRentalDetailsData?.order?.order_items?.map(
                          (kegRental, index) => (
                            <tr key={index}>
                              <td>
                                {index + 1 < 10 ? `0${index + 1}` : index + 1}
                              </td>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <div className="squareImageWrapper">
                                    <img
                                      src={
                                        kegRental?.product?.medias[0]
                                          ?.media_path ||
                                        images?.defaultPlaceholder
                                      }
                                      alt={kegRental?.product?.title}
                                      onError={(e) => {
                                        e.target.src =
                                          images?.defaultPlaceholder;
                                      }}
                                      className="squareImage"
                                    />
                                  </div>
                                  <div>
                                    <p className="text14">
                                      {kegRental?.product?.title || '-'}
                                    </p>
                                    <p className="text13">
                                      {kegRental?.product?.category ||
                                        'Category'}
                                    </p>
                                    <p className="colorGrayDark text13">
                                      {kegRental?.product?.sub_category ||
                                        'Sub Category'}
                                    </p>
                                    <p className="colorGrayDark text13">
                                      Keg size:{' '}
                                      {kegRental?.product?.keg_size ||
                                        'Sub Category'}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td>${kegRental?.product?.price || '-'}</td>
                              <td>${kegRental?.product?.deposit || '-'}</td>
                              <td>{kegRental?.product?.quantity || '-'}</td>
                              <td>${kegRental?.price || '-'}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </CustomTable>
                  </div>
                </div>
                <div className="orderSummary row mb-4">
                  <div className="col-12">
                    <h5 className="secondaryTitle mb-3">Order Summary</h5>
                  </div>
                  <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
                      <p className="textLabel">Deposit Amount:</p>
                      <div className="text-end">
                        {isKegRentalDetailsLoading ? (
                          <LineSkeleton width="120px" />
                        ) : (
                          <p className="textValue">
                            ${kegRentalDetailsData?.deposit_amount || '0'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
                      <p className="textLabel">Sub Total:</p>
                      <div className="text-end">
                        {isKegRentalDetailsLoading ? (
                          <LineSkeleton width="120px" />
                        ) : (
                          <p className="textValue">
                            ${kegRentalDetailsData?.order?.sub_total || '0'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
                      <p className="textLabel">Promo Code:</p>
                      <div className="text-end">
                        {isKegRentalDetailsLoading ? (
                          <>
                            <LineSkeleton width="120px" />
                            <LineSkeleton width="60px" />
                          </>
                        ) : (
                          <>
                            <p className="textValue">
                              {(kegRentalDetailsData?.order?.promo_code_id &&
                                `#${kegRentalDetailsData?.order?.promo_code_id}`) ||
                                '-'}
                            </p>
                            <p className="colorGrayDark text13">
                              -{kegRentalDetailsData?.order?.discount || '0'}%
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
                      <p className="textLabel">Referral Code:</p>
                      <div className="text-end">
                        {isKegRentalDetailsLoading ? (
                          <>
                            <LineSkeleton width="120px" />
                            <LineSkeleton width="60px" />
                          </>
                        ) : (
                          <>
                            <p className="textValue">
                              {(kegRentalDetailsData?.order?.referral_id &&
                                `#${kegRentalDetailsData?.order?.referral_id}`) ||
                                '-'}
                            </p>
                            <p className="colorGrayDark text13">
                              -
                              {kegRentalDetailsData?.order
                                ?.referral_code_discount || '0'}
                              %
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
                      <p className="textLabel">Total:</p>
                      <div className="text-end">
                        {isKegRentalDetailsLoading ? (
                          <LineSkeleton width="120px" />
                        ) : (
                          <p className="textValue">
                            ${kegRentalDetailsData?.order?.total || '0'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="contactInformation row mb-4">
                  <div className="col-12">
                    <h5 className="secondaryTitle mb-3">Contact Information</h5>
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">First Name:</p>
                    {isKegRentalDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {kegRentalDetailsData?.order?.contact_information
                          ?.first_name || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Last Name:</p>
                    {isKegRentalDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {kegRentalDetailsData?.order?.contact_information
                          ?.last_name || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Phone:</p>
                    {isKegRentalDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {kegRentalDetailsData?.order?.contact_information
                          ?.phone || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Email:</p>
                    {isKegRentalDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {kegRentalDetailsData?.order?.contact_information
                          ?.email || '-'}
                      </p>
                    )}
                  </div>
                </div>
                <div className="shippingAddress row mb-4">
                  <div className="col-12">
                    <h5 className="secondaryTitle mb-3">Shipping Address</h5>
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">First Name:</p>
                    {isKegRentalDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {kegRentalDetailsData?.order?.shipping_address
                          ?.first_name || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Last Name:</p>
                    {isKegRentalDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {kegRentalDetailsData?.order?.shipping_address
                          ?.last_name || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Phone:</p>
                    {isKegRentalDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {kegRentalDetailsData?.order?.shipping_address?.phone ||
                          '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Address:</p>
                    {isKegRentalDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {kegRentalDetailsData?.order?.shipping_address
                          ?.street_address || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Country:</p>
                    {isKegRentalDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {kegRentalDetailsData?.order?.shipping_address
                          ?.country || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">State:</p>
                    {isKegRentalDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {kegRentalDetailsData?.order?.shipping_address?.state ||
                          '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">City:</p>
                    {isKegRentalDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {kegRentalDetailsData?.order?.shipping_address?.city ||
                          '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Zip Code:</p>
                    {isKegRentalDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {kegRentalDetailsData?.order?.shipping_address
                          ?.zip_code || '-'}
                      </p>
                    )}
                  </div>
                </div>
                <div className="billingAddress row mb-4">
                  <div className="col-12">
                    <h5 className="secondaryTitle mb-3">Billing Address</h5>
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">First Name:</p>
                    {isKegRentalDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {kegRentalDetailsData?.order?.billing_address
                          ?.first_name || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Last Name:</p>
                    {isKegRentalDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {kegRentalDetailsData?.order?.billing_address
                          ?.last_name || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Phone:</p>
                    {isKegRentalDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {kegRentalDetailsData?.order?.billing_address?.phone ||
                          '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Address:</p>
                    {isKegRentalDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {kegRentalDetailsData?.order?.billing_address
                          ?.street_address || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Country:</p>
                    {isKegRentalDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {kegRentalDetailsData?.order?.billing_address
                          ?.country || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">State:</p>
                    {isKegRentalDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {kegRentalDetailsData?.order?.billing_address?.state ||
                          '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">City:</p>
                    {isKegRentalDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {kegRentalDetailsData?.order?.billing_address?.city ||
                          '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Zip Code:</p>
                    {isKegRentalDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {kegRentalDetailsData?.order?.billing_address
                          ?.zip_code || '-'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CustomCard>
        </div>
      </div>
    </div>
  );
};

const CancelOrderForm = ({ id, action, closeModal, loading }) => {
  const [reason, setReason] = useState('');
  return (
    <div className="row my-3 mx-3">
      <div className="col-12 text-start">
        <CustomInput
          label="Reason"
          id="reason"
          name="reason"
          type="textarea"
          rows={3}
          placeholder="Enter Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
      </div>
      <div className="col-12 text-end">
        <CustomButton
          text="Submit"
          loading={loading}
          onClick={async () => {
            await action({
              id,
              payload: { status: 2, cancellation_reason: reason },
            });
            closeModal();
          }}
        />
      </div>
    </div>
  );
};

export default KegRentalDetails;
