import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { dateFormat } from '../../../../../Utils/Utils';
import useModalStore from '../../../../../Store/ModalStore';
import { images } from '../../../../../assets/images';

import GetOrderDetails from './Services/GetOrderDetails';
import ChangeOrderStatus from './Services/ChangeOrderStatus';

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
  { id: 4, key: 'quantity', title: 'Quantity' },
  { id: 5, key: 'total', title: 'Total' },
];

const OrderDetails = () => {
  const { id } = useParams();
  const { showModal, closeModal } = useModalStore();
  const queryClient = useQueryClient();

  const {
    data: orderDetailsData,
    isLoading: isOrderDetailsLoading,
    isError: isOrderDetailsError,
    error: orderDetailsError,
  } = useQuery({
    queryKey: ['orderDetails', id],
    queryFn: () => GetOrderDetails(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  const { mutateAsync: deliveredOrderMutation } = useMutation({
    mutationFn: (data) => ChangeOrderStatus(data),
    onSuccess: ({ message }) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message:
            message || 'Order has been marked as delivered successfully!',
          continueText: 'Okay',
          onContinue: () => {
            queryClient.invalidateQueries({
              queryKey: ['orderDetails', 'orders'],
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

  const { mutateAsync: cancelOrderMutation, isLoading: cancelOrderLoading } =
    useMutation({
      mutationFn: (id, payload) => ChangeOrderStatus(id, payload),
      onSuccess: ({ message }) => {
        showModal({
          type: 'success',
          modalProps: {
            title: 'Successful',
            hideClose: true,
            message: message || 'Order has been canceled successfully!',
            continueText: 'Okay',
            onContinue: () => {
              queryClient.invalidateQueries({
                queryKey: ['orderDetails', 'orders'],
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

  const handleMarkAsDelivered = (id) => {
    showModal({
      type: 'question',
      modalProps: {
        title: 'Mark as Delivered',
        message: 'Are you sure you want to mark the order as delivered?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          await deliveredOrderMutation({ id, payload: { status: 1 } });
          closeModal();
        },
      },
    });
  };

  const handleCancelOrder = (id) => {
    showModal({
      type: 'question',
      modalProps: {
        title: 'Cancel Order',
        message: 'Are you sure you want to cancel the order?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: () => {
          closeModal();
          showModal({
            type: 'info',
            modalProps: {
              title: 'Successful',
              message: 'Order has been canceled successfully!',
              continueText: 'Okay',
              children: (
                <CancelOrderForm
                  id={id}
                  action={cancelOrderMutation}
                  closeModal={closeModal}
                  loading={cancelOrderLoading}
                />
              ),
            },
          });
        },
      },
    });
  };

  return (
    <div className="orderDetailsScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title="Order Details"
            backButton={true}
            backLink={'/order-management'}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            {isOrderDetailsError ? (
              <p className="text-center fs-4 my-4 text-danger">
                {orderDetailsError || 'Something went wrong'}
              </p>
            ) : (
              <div className="my-3">
                <div className="orderDetails row mb-4">
                  <div className="col-xl-2 order-xl-2 text-end">
                    <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                      <p className="textLabel">Status:</p>
                      {isOrderDetailsLoading ? (
                        <LineSkeleton width="120px" />
                      ) : (
                        <p
                          className={`text-capitalize ${
                            orderDetailsData?.status == 0
                              ? 'colorYellowDark'
                              : orderDetailsData?.status == 1
                              ? 'colorGreen'
                              : 'colorRed'
                          }`}
                        >
                          {orderDetailsData?.status_detail || 'N/A'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-xl-10 order-xl-1">
                    <div className="row">
                      <div className="col-6">
                        <div className="mb-3">
                          <p className="textLabel">Order ID:</p>
                          {isOrderDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {orderDetailsData?.id || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-3">
                          <p className="textLabel">Order Date:</p>
                          {isOrderDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {dateFormat(orderDetailsData?.created_at) || '-'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {orderDetailsData?.status == 0 && (
                      <div className="row mt-4">
                        <div className="col-12">
                          <div className="d-flex align-items-center gap-2">
                            <CustomButton
                              text="Cancel Order"
                              onClick={() => handleCancelOrder(id)}
                            />
                            <CustomButton
                              text="Chat"
                              // onClick={() => handleCancelOrder(id)}
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
                      loading={isOrderDetailsLoading}
                      rows={orderDetailsData?.order_items?.length}
                    >
                      <tbody>
                        {isOrderDetailsError ||
                          (orderDetailsData?.order_items?.length == 0 && (
                            <tr>
                              <td
                                colSpan={headers?.length}
                                className="text-center"
                              >
                                {orderDetailsError?.message || 'No data found'}
                              </td>
                            </tr>
                          ))}
                        {orderDetailsData?.order_items?.map((order, index) => (
                          <tr key={index}>
                            <td>
                              {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div className="squareImageWrapper">
                                  <img
                                    src={
                                      order?.product?.medias[0]?.media_path ||
                                      images?.defaultPlaceholder
                                    }
                                    alt={order?.product?.title}
                                    onError={(e) => {
                                      e.target.src = images?.defaultPlaceholder;
                                    }}
                                    className="squareImage"
                                  />
                                </div>
                                <div>
                                  <p className="text14">
                                    {order?.product?.title || '-'}
                                  </p>
                                  <p className="text13">
                                    {order?.product?.category || 'Category'}
                                  </p>
                                  <p className="colorGrayDark text13">
                                    {order?.product?.sub_category ||
                                      'Sub Category'}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td>${order?.product?.price || '-'}</td>
                            <td>{order?.product?.quantity || '-'}</td>
                            <td>${order?.price || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </CustomTable>
                  </div>
                </div>
                {orderDetailsData?.status == 0 && (
                  <div className="orderAction row mb-4">
                    <div className="col-12">
                      <div className="d-flex align-items-center gap-3">
                        <CustomButton
                          text="Mark as Delivered"
                          onClick={() => handleMarkAsDelivered(id)}
                          disabled={!orderDetailsData}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="orderSummary row mb-4">
                  <div className="col-12">
                    <h5 className="secondaryTitle mb-3">Order Summary</h5>
                  </div>
                  <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
                      <p className="textLabel">Sub Total:</p>
                      <div className="text-end">
                        {isOrderDetailsLoading ? (
                          <LineSkeleton width="120px" />
                        ) : (
                          <p className="textValue">
                            <>${orderDetailsData?.sub_total || '0'}</>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
                      <p className="textLabel">Discount:</p>
                      <div className="text-end">
                        {isOrderDetailsLoading ? (
                          <LineSkeleton width="120px" />
                        ) : (
                          <p className="textValue">
                            ${orderDetailsData?.discount || '0'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
                      <p className="textLabel">Total:</p>
                      <div className="text-end">
                        {isOrderDetailsLoading ? (
                          <LineSkeleton width="120px" />
                        ) : (
                          <p className="textValue">
                            <>${orderDetailsData?.total || '0'}</>
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
                    {isOrderDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {orderDetailsData?.contact_information?.first_name ||
                          '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Last Name:</p>
                    {isOrderDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {orderDetailsData?.contact_information?.last_name ||
                          '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Phone:</p>
                    {isOrderDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {orderDetailsData?.contact_information?.phone || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Email:</p>
                    {isOrderDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {orderDetailsData?.contact_information?.email || '-'}
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
                    {isOrderDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {orderDetailsData?.shipping_address?.first_name || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Last Name:</p>
                    {isOrderDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {orderDetailsData?.shipping_address?.last_name || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Phone:</p>
                    {isOrderDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {orderDetailsData?.shipping_address?.phone || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Address:</p>
                    {isOrderDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {orderDetailsData?.shipping_address?.street_address ||
                          '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Country:</p>
                    {isOrderDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {orderDetailsData?.shipping_address?.country || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">State:</p>
                    {isOrderDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {orderDetailsData?.shipping_address?.state || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">City:</p>
                    {isOrderDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {orderDetailsData?.shipping_address?.city || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Zip Code:</p>
                    {isOrderDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {orderDetailsData?.shipping_address?.zip_code || '-'}
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
                    {isOrderDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {orderDetailsData?.billing_address?.first_name || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Last Name:</p>
                    {isOrderDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {orderDetailsData?.billing_address?.last_name || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Phone:</p>
                    {isOrderDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {orderDetailsData?.billing_address?.phone || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Address:</p>
                    {isOrderDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {orderDetailsData?.billing_address?.street_address ||
                          '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Country:</p>
                    {isOrderDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {orderDetailsData?.billing_address?.country || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">State:</p>
                    {isOrderDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {orderDetailsData?.billing_address?.state || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">City:</p>
                    {isOrderDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {orderDetailsData?.billing_address?.city || '-'}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mb-2">
                    <p className="textLabel">Zip Code:</p>
                    {isOrderDetailsLoading ? (
                      <LineSkeleton width="120px" />
                    ) : (
                      <p className="textValue">
                        {orderDetailsData?.billing_address?.zip_code || '-'}
                      </p>
                    )}
                  </div>
                </div>
                {orderDetailsData?.status == 2 && (
                  <div className="cancelOrderReason row mb-4">
                    <div className="col-12">
                      <p className="textLabel">Reason:</p>
                      <p className="textValue">
                        {orderDetailsData?.cancellation_reason || '-'}
                      </p>
                    </div>
                  </div>
                )}
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

export default OrderDetails;
