import React from 'react';
import { useParams } from 'react-router-dom';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { images } from '../../../../../assets/images';

import GetProductDetails from './Services/GetProductDetails';
import ChangeProductStatus from '../Services/ChangeProductStatus';

import PageTitle from '../../../../../Components/PageTitle';
import CustomCard from '../../../../../Components/CustomCard';
import CustomButton from '../../../../../Components/CustomButton';
import LineSkeleton from '../../../../../Components/SkeletonLoaders/LineSkeleton';
import StatusDropdown from '../../../../../Components/StatisDropdown';
import { showToast } from '../../../../../Components/CustomToast';
import useModalStore from '../../../../../Store/ModalStore';

import './style.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { showModal, closeModal } = useModalStore();
  const queryClient = useQueryClient();
  const {
    data: productDetailsData,
    isLoading: isProductDetailsLoading,
    isError: isProductDetailsError,
    error: productDetailsError,
  } = useQuery({
    queryKey: ['productDetails', id],
    queryFn: () => GetProductDetails(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  const { mutateAsync: changeStatusMutation } = useMutation({
    mutationFn: (id) => ChangeProductStatus(id),
    onSuccess: ({ message }) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message: message || 'Product has been activated successfully!',
          continueText: 'Okay',
          onContinue: () => {
            closeModal();
          },
        },
      });
      queryClient.invalidateQueries({ queryKey: ['productDetails'] });
    },
    onError: (error) => {
      showToast(error?.message || 'Status change failed', 'error');
    },
  });

  const handleChangeStatus = (id, status) => {
    const title = status == 1 ? 'Deactivate Product?' : 'Activate Product?';
    const message =
      status == 1
        ? 'Are you sure you want to deactivate the Product?'
        : 'Are you sure you want to activate the Product?';
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
    <div className="productScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title="View Product details"
            backButton={true}
            backLink={'/product-management'}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            {isProductDetailsError ? (
              <p className="text-center fs-4 my-4 text-danger">
                {productDetailsError || 'Something went wrong'}
              </p>
            ) : (
              <>
                <div className="row productDetails my-3">
                  <div className="col-xl-2 order-xl-2 text-end">
                    <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                      <p className="textLabel">Status:</p>
                      {isProductDetailsLoading ? (
                        <LineSkeleton />
                      ) : (
                        <StatusDropdown
                          variant="secondary"
                          selected={
                            productDetailsData?.status == 0
                              ? { value: 0, label: 'Deactivate' }
                              : productDetailsData?.status == 1
                              ? { value: 1, label: 'Activate' }
                              : { value: 2, label: 'Pending' }
                          }
                          options={[
                            {
                              value: productDetailsData?.status == 1 ? 0 : 1,
                              label:
                                productDetailsData?.status == 1
                                  ? 'Deactivate'
                                  : 'Activate',
                              onClick: () => {
                                handleChangeStatus(
                                  productDetailsData?.id,
                                  productDetailsData?.status
                                );
                              },
                            },
                          ]}
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-xl-10 order-xl-1">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-12">
                            <div className="mb-3">
                              <p className="textLabel">Product name:</p>
                              {isProductDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  {productDetailsData?.title || 'N/A'}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="mb-3">
                              <p className="textLabel">Description:</p>
                              {isProductDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  {productDetailsData?.description || 'N/A'}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="mb-3">
                              <p className="textLabel">Category:</p>
                              {isProductDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  {productDetailsData?.category?.title || 'N/A'}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-12 ">
                            <div className="mb-3">
                              <p className="textLabel">Sub-Category:</p>
                              {isProductDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  {productDetailsData?.sub_category?.title ||
                                    'N/A'}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-12 ">
                            <div className="mb-3">
                              <p className="textLabel">Beverage Type:</p>
                              {isProductDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  {productDetailsData?.preference?.title ||
                                    'N/A'}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-12 ">
                            <div className="mb-3">
                              <p className="textLabel">Beverage Taste:</p>
                              {isProductDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  {productDetailsData?.beverage_taste || 'N/A'}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-12 ">
                            <div className="mb-3">
                              <p className="textLabel">Product Images:</p>
                              {isProductDetailsLoading ? (
                                <LineSkeleton
                                  width="160px"
                                  height="160px"
                                  borderRadius="10px"
                                />
                              ) : (
                                <div className="d-flex gap-2 mt-3">
                                  {productDetailsData?.medias &&
                                    productDetailsData?.medias.length > 0 &&
                                    productDetailsData?.medias.map(
                                      (item, index) => (
                                        <div className="squareImageWrapper">
                                          <img
                                            key={index}
                                            className="squareImage"
                                            src={item?.media_path}
                                            onError={(e) => {
                                              e.target.src =
                                                images?.defaultPlaceholder;
                                            }}
                                            alt="Product"
                                          />
                                        </div>
                                      )
                                    )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-12">
                            <div className="mb-3">
                              <p className="textLabel">Keg Size:</p>
                              {isProductDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  {productDetailsData?.keg_size || 'N/A'}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="mb-3">
                              <p className="textLabel">Accessories:</p>
                              {isProductDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  {productDetailsData?.accessories || 'N/A'}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="mb-3">
                              <p className="textLabel">Keg Rental Duration:</p>
                              {isProductDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  {productDetailsData?.keg_rental_duration ||
                                    'N/A'}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-12 ">
                            <div className="mb-3">
                              <p className="textLabel">Deposit:</p>
                              {isProductDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  ${productDetailsData?.deposit || 'N/A'}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-12 ">
                            <div className="mb-3">
                              <p className="textLabel">Price:</p>
                              {isProductDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  ${productDetailsData?.price || 'N/A'}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-12 ">
                            <div className="mb-3">
                              <p className="textLabel">Quantity:</p>
                              {isProductDetailsLoading ? (
                                <LineSkeleton />
                              ) : (
                                <p className="textValue">
                                  {productDetailsData?.quantity || 'N/A'}
                                </p>
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
                        text="Edit  "
                        tabIndex={3}
                        to={`/product-management/edit-product/${id}`}
                        disabled={isProductDetailsLoading}
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

export default ProductDetails;
