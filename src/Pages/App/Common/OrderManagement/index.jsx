import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import GetOrders from './Services/GetOrders';

import withFilters from '../../../../HOC/withFilters ';
import { dateFormat } from '../../../../Utils/Utils';
import { LuEye } from 'react-icons/lu';
import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomTable from '../../../../Components/CustomTable';
import CustomFilters from '../../../../Components/CustomFilters';
import CustomTableActionDropdown from '../../../../Components/CustomTableActionDropdown';

const headers = [
  { id: 1, key: 'sNo', title: 'S.No' },
  { id: 2, key: 'orderNo', title: 'Order ID' },
  { id: 3, key: 'userName', title: 'User Name' },
  { id: 4, key: 'orderDate', title: 'Order Date' },
  { id: 5, key: 'amount', title: 'Amount' },
  { id: 6, key: 'status', title: 'Status' },
  { id: 7, key: 'action', title: 'Action' },
];

// eslint-disable-next-line react-refresh/only-export-components
const OrderManagement = ({ filters, setFilters, pagination }) => {
  const navigate = useNavigate();
  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    error: ordersError,
  } = useQuery({
    queryKey: ['orders', pagination, filters],
    queryFn: () => GetOrders(filters, pagination),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
    retry: 2,
  });

  return (
    <div className="orderManagementScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle title="Order Management" />
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
                        title: 'Upload Date',
                        from: 'from',
                        to: 'to',
                      },
                    ]}
                    // selectOptions={[
                    //   {
                    //     title: 'status',
                    //     options: [
                    //       { value: '', label: 'All' },
                    //       { value: '1', label: 'Active' },
                    //       { value: '0', label: 'Inactive' },
                    //     ],
                    //   },
                    // ]}
                    pagination={ordersData?.meta}
                  >
                    <CustomTable
                      headers={headers}
                      loading={isOrdersLoading}
                      rows={filters.per_page}
                    >
                      <tbody>
                        {isOrdersError ||
                          (ordersData?.data?.length == 0 && (
                            <tr>
                              <td
                                colSpan={headers?.length}
                                className="text-center"
                              >
                                {ordersError?.message || 'No data found'}
                              </td>
                            </tr>
                          ))}
                        {ordersData?.data?.map((order, index) => (
                          <tr key={index}>
                            <td>
                              {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </td>
                            <td>{order?.id || '-'}</td>
                            <td>{order?.user?.full_name || '-'}</td>
                            <td>{dateFormat(order?.created_at) || '-'}</td>
                            <td>${order?.total || '-'}</td>
                            <td
                              className={`text-capitalize ${
                                order?.status == 0
                                  ? 'colorYellowDark'
                                  : order?.status == 1
                                  ? 'colorGreen'
                                  : 'colorRed'
                              }`}
                            >
                              {order?.status_detail || '-'}
                            </td>
                            <td>
                              <CustomTableActionDropdown
                                actions={[
                                  {
                                    icon: <LuEye />,
                                    label: 'View',
                                    onClick: () => {
                                      navigate(
                                        `/order-management/order-details/${order?.id}`
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
export default withFilters(OrderManagement);
