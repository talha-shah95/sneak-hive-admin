import React from 'react';
import { useParams } from 'react-router-dom';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useModalStore from '../../../../Store/ModalStore';

import GetProduct from './Services/GetProduct';
import ChangeProductStatus from '../Services/ChangeProductStatus';

import { images } from '../../../../assets/images';

import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import LineSkeleton from '../../../../Components/SkeletonLoaders/LineSkeleton';
import CustomButton from '../../../../Components/CustomButton';
import { availabilityTextFormatter } from '../Helpers';
import { showToast } from '../../../../Components/CustomToast';

const ProductDetails = () => {
  const { id } = useParams();
  const { showModal, closeModal } = useModalStore();
  const queryClient = useQueryClient();

  const { mutateAsync: changeStatusMutation } = useMutation({
    mutationFn: (id) => ChangeProductStatus(id),
    onSuccess: ({ message }) => {
      showModal({
        type: 'success',
        showSuccessToast: false,
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message: message || 'Product status changed successfully!',
          continueText: 'Ok',
          onContinue: () => {
            closeModal();
          },
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['productDetails', 'products'],
      });
    },
    onError: (error) => {
      showToast(error?.message || 'Status change failed', 'error');
    },
  });

  const {
    data: productDetailsData,
    isLoading: isProductDetailsLoading,
    isError: isProductDetailsError,
    error: productDetailsError,
  } = useQuery({
    queryKey: ['productDetails', id],
    queryFn: () => GetProduct(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  const handleChangeStatus = (id, status) => {
    const title = status == 1 ? 'Inactivate Product?' : 'Activate Product?';
    const message =
      status == 1
        ? 'Are you sure you want to inactivate the Product?'
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
    <div className="productDetailsScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title="View Product"
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
                      <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                        <p className="textLabel">Status:</p>
                        {isProductDetailsLoading ? (
                          <LineSkeleton width="120px" />
                        ) : (
                          <p
                            className={`text-capitalize ${
                              productDetailsData?.is_active == 1
                                ? 'colorGreen'
                                : productDetailsData?.is_active == 0
                                ? 'colorRed'
                                : 'colorYellowDark'
                            }`}
                          >
                            {productDetailsData?.is_active == 1
                              ? 'Active'
                              : productDetailsData?.is_active == 0
                              ? 'Inactive'
                              : 'Pending'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-10 order-xl-1">
                    <div className="row mb-4">
                      <div className="col-12 ">
                        <div className="mb-4">
                          <p className="textLabel mb-3">Product Images:</p>
                          {isProductDetailsLoading ? (
                            <LineSkeleton
                              width="160px"
                              height="160px"
                              borderRadius="10px"
                            />
                          ) : (
                            <div className="d-flex flex-wrap gap-3">
                              {productDetailsData.images.map((image, index) => (
                                <div className="squareImageWrapper" key={index}>
                                  <img
                                    className="squareImage"
                                    src={
                                      image?.file || images?.defaultPlaceholder
                                    }
                                    onError={(e) => {
                                      e.target.src = images?.defaultPlaceholder;
                                    }}
                                    alt="Product"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Product Name:</p>
                          {isProductDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {productDetailsData?.name || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Price:</p>
                          {isProductDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              ${productDetailsData?.price || '0'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Stock Availability:</p>
                          {isProductDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p
                              className={`text-capitalize ${
                                productDetailsData?.availibility == 'in_stock'
                                  ? 'colorGreenDark'
                                  : productDetailsData?.availibility ==
                                    'out_of_stock'
                                  ? 'colorRed'
                                  : 'colorYellowDark'
                              }`}
                            >
                              {availabilityTextFormatter(
                                productDetailsData?.availibility
                              ) || '-'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Category:</p>
                          {isProductDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <>
                              <p className="textValue">
                                {productDetailsData?.categories?.map(
                                  (category, index) => (
                                    <span key={index}>
                                      {category?.name || 'N/A'}
                                      {index <
                                        productDetailsData?.categories?.length -
                                          1 && ' / '}
                                    </span>
                                  )
                                )}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Sub Category:</p>
                          {isProductDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <>
                              <p className="textValue">
                                {productDetailsData?.subcategories?.map(
                                  (subCategory, index) => (
                                    <span key={index}>
                                      {subCategory?.name || 'N/A'}
                                      {index <
                                        productDetailsData?.subcategories
                                          ?.length -
                                          1 && ' / '}
                                    </span>
                                  )
                                )}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-4">
                        <div className="mb-3">
                          <p className="textLabel">Affiliate Link:</p>
                          {isProductDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {productDetailsData?.affiliate_link || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <p className="textLabel">Product Description:</p>
                          {isProductDetailsLoading ? (
                            <LineSkeleton width="120px" />
                          ) : (
                            <p className="textValue">
                              {productDetailsData?.description || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <div className="d-flex align-items-center gap-3">
                          <CustomButton
                            text="Edit"
                            variant="secondary"
                            className="w-auto d-inline-block"
                            to={`/product-management/edit-product/${id}`}
                            disabled={isProductDetailsLoading}
                          />
                          <CustomButton
                            text={
                              productDetailsData?.is_active == 1
                                ? 'Mark as Inactive'
                                : 'Mark as Active'
                            }
                            tabIndex={3}
                            variant="secondaryOrange"
                            disabled={isProductDetailsLoading}
                            onClick={() => {
                              handleChangeStatus(
                                id,
                                productDetailsData?.is_active
                              );
                            }}
                          />
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

export default ProductDetails;
