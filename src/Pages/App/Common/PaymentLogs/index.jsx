import React from 'react';

import { useQuery } from '@tanstack/react-query';

import GetPaymentLogs from './Services/GetPaymentLogs';

import withFilters from '../../../../HOC/withFilters ';
// import { dateFormat } from '../../../../Utils/Utils';

import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomTable from '../../../../Components/CustomTable';
import CustomFilters from '../../../../Components/CustomFilters';

const headers = [
  { id: 1, key: 'sNo', title: 'S.No' },
  { id: 2, key: 'orderNo', title: 'Order No.' },
  { id: 3, key: 'userName', title: 'User Name' },
  { id: 4, key: 'orderDate', title: 'Order Date' },
  { id: 4, key: 'adminCommission', title: 'Admin Commission' },
  { id: 5, key: 'verifiedUserCommission', title: 'Verified User Commission' },
  { id: 5, key: 'amount', title: 'Amount' },
];

// eslint-disable-next-line react-refresh/only-export-components
const PaymentLogs = ({ filters, setFilters, pagination }) => {
  const {
    data: paymentLogsData,
    isLoading: isPaymentLogsLoading,
    isError: isPaymentLogsError,
    error: paymentLogsError,
  } = useQuery({
    queryKey: ['paymentLogs', pagination, filters],
    queryFn: () => GetPaymentLogs(filters, pagination),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
    retry: 2,
  });

  return (
    <div className="documentsHistoryScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle title="Payment Logs" />
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
                    pagination={paymentLogsData?.meta}
                  >
                    <CustomTable
                      headers={headers}
                      loading={isPaymentLogsLoading}
                      rows={filters.per_page}
                    >
                      <tbody>
                        {isPaymentLogsError ||
                          (paymentLogsData?.data?.length == 0 && (
                            <tr>
                              <td
                                colSpan={headers.length}
                                className="text-center"
                              >
                                {paymentLogsError?.message || 'No data found'}
                              </td>
                            </tr>
                          ))}
                        {paymentLogsData?.data?.map((document, index) => (
                          <tr key={index}>
                            <td>
                              {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </td>
                            {/* <td>{document?.order_no || 'N/A'}</td>
                            <td>{document?.user_name || 'N/A'}</td> */}
                            {/* <td>{dateFormat(document?.created_at) || 'N/A'}</td>
                            <td>
                              {dateFormat(document?.verification_date) || 'N/A'}
                            </td>
                            <td>
                              {dateFormat(document?.expiration_date) || 'N/A'}
                            </td> */}
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
export default withFilters(PaymentLogs);
