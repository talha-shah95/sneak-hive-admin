import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import useModalStore from '../../../../Store/ModalStore';

import GetProducts from './Services/GetProducts';
import ChangeProductStatus from '../ProductManagement/Services/ChangeProductStatus';

import withFilters from '../../../../HOC/withFilters ';
import { dateFormat } from '../../../../Utils/Utils';

import { LuEye, LuPencil } from 'react-icons/lu';

import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomButton from '../../../../Components/CustomButton';
import CustomTable from '../../../../Components/CustomTable';
import CustomTableActionDropdown from '../../../../Components/CustomTableActionDropdown';
import StatusDropdown from '../../../../Components/StatisDropdown';
import CustomFilters from '../../../../Components/CustomFilters';
import { showToast } from '../../../../Components/CustomToast';

// const timePeriods = [
//   { value: 'all', label: 'All' },
//   { value: 'active', label: 'Active' },
//   { value: 'inactive', label: 'Inactive' },
// ];

const headers = [
  { id: 1, key: 'sNo', title: 'S.No' },
  { id: 2, key: 'productName', title: 'Product Name' },
  { id: 3, key: 'category', title: 'Category' },
  { id: 4, key: 'subCategory', title: 'Sub Category' },
  { id: 5, key: 'beverageType', title: 'Beverage Type' },
  { id: 6, key: 'kegs', title: 'Kegs' },
  { id: 7, key: 'registrationDate', title: 'Registration Date' },
  { id: 8, key: 'status', title: 'Status' },
  { id: 9, key: 'action', title: 'Action' },
];

// eslint-disable-next-line react-refresh/only-export-components
const ProductManagement = ({ filters, setFilters, pagination }) => {
  const { showModal, closeModal } = useModalStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    data: productsData,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
  } = useQuery({
    queryKey: ['products', pagination, filters],
    queryFn: () => GetProducts(filters, pagination),
    staleTime: 1000 * 60 * 5, // 5 minutes
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
      queryClient.invalidateQueries({ queryKey: ['products'] });
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
    <div className="productManagementScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle title="Product Management" />
        </div>
        <div className="col-12 col-xl-6 text-end">
          <CustomButton
            text="Add Product"
            to={'/product-management/add-product'}
            className="w-auto d-inline-block"
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            <div className="row">
              <div className="col-12">
                <div className="mb-3">
                  <CustomFilters
                    setFilters={setFilters}
                    filters={filters}
                    sorting={[
                      { value: 5, label: '5' },
                      { value: 10, label: '10' },
                      { value: 25, label: '25' },
                      { value: 50, label: '50' },
                    ]}
                    search={true}
                    dateFilters={[
                      {
                        title: 'Registration Date',
                        from: 'from',
                        to: 'to',
                      },
                    ]}
                    // selectOptions={[
                    //   {
                    //     title: 'status',
                    //     options: [
                    //       { value: 10, label: '10' },
                    //       { value: 25, label: '25' },
                    //       { value: 50, label: '50' },
                    //     ],
                    //   },
                    // ]}
                    pagination={productsData?.meta}
                  >
                    <CustomTable
                      headers={headers}
                      loading={isProductsLoading}
                      rows={filters.per_page}
                    >
                      <tbody>
                        {isProductsError ||
                          (productsData?.data?.length == 0 && (
                            <tr>
                              <td
                                colSpan={headers.length}
                                className="text-center"
                              >
                                {productsError?.message || 'No data found'}
                              </td>
                            </tr>
                          ))}
                        {productsData?.data?.map((product, index) => (
                          <tr key={product.id}>
                            <td>
                              {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </td>
                            <td>{product?.title}</td>
                            <td>{product?.category?.title}</td>
                            <td>{product?.sub_category?.title}</td>
                            <td>{product?.preference?.title}</td>
                            <td>{product?.keg_size}</td>
                            <td>{dateFormat(product?.created_at)}</td>
                            <td>
                              <StatusDropdown
                                selected={
                                  product?.status == 0
                                    ? { value: 0, label: 'Deactivate' }
                                    : product?.status == 1
                                    ? { value: 1, label: 'Activate' }
                                    : { value: 2, label: 'Pending' }
                                }
                                options={[
                                  {
                                    value: product?.status == 1 ? 0 : 1,
                                    label:
                                      product?.status == 1
                                        ? 'Deactivate'
                                        : 'Activate',
                                    onClick: () => {
                                      handleChangeStatus(
                                        product?.id,
                                        product?.status
                                      );
                                    },
                                  },
                                ]}
                              />
                            </td>
                            <td>
                              <CustomTableActionDropdown
                                actions={[
                                  {
                                    icon: <LuEye />,
                                    label: 'View',
                                    onClick: () => {
                                      navigate(
                                        `/product-management/product-details/${product?.id}`
                                      );
                                    },
                                  },
                                  {
                                    icon: <LuPencil />,
                                    label: 'Edit',
                                    onClick: () => {
                                      navigate(
                                        `/product-management/edit-product/${product?.id}`
                                      );
                                    },
                                  },
                                ]}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </CustomTable>
                  </CustomFilters>
                </div>
              </div>
            </div>
          </CustomCard>
        </div>
      </div>
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default withFilters(ProductManagement);
