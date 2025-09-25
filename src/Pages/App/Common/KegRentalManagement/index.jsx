import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import GetKegRental from './Services/GetKegRental';

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
  { id: 2, key: 'orderId', title: 'Order ID' },
  { id: 3, key: 'userName', title: 'User Name' },
  { id: 4, key: 'orderDate', title: 'Order Date' },
  { id: 5, key: 'noOfKegs', title: 'No of Kegs' },
  { id: 6, key: 'kegRentalDuration', title: 'Keg Rental Duration' },
  { id: 7, key: 'depositAmount', title: 'Deposit Amount' },
  { id: 8, key: 'status', title: 'Status' },
  { id: 9, key: 'action', title: 'Action' },
];

// eslint-disable-next-line react-refresh/only-export-components
const KegRentalManagement = ({ filters, setFilters, pagination }) => {
  const navigate = useNavigate();
  const {
    data: kegRentalData,
    isLoading: isKegRentalLoading,
    isError: isKegRentalError,
    error: kegRentalError,
  } = useQuery({
    queryKey: ['kegRental', pagination, filters],
    queryFn: () => GetKegRental(filters, pagination),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
    retry: 2,
  });

  return (
    <div className="kegRentalManagementScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle title="Keg Rental Management" />
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
                    pagination={kegRentalData?.meta}
                  >
                    <CustomTable
                      headers={headers}
                      loading={isKegRentalLoading}
                      rows={filters.per_page}
                    >
                      <tbody>
                        {isKegRentalError ||
                          (kegRentalData?.data?.length == 0 && (
                            <tr>
                              <td
                                colSpan={headers?.length}
                                className="text-center"
                              >
                                {kegRentalError?.message || 'No data found'}
                              </td>
                            </tr>
                          ))}
                        {kegRentalData?.data?.map((kegRental, index) => (
                          <tr key={index}>
                            <td>
                              {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </td>
                            <td>{kegRental?.id || '-'}</td>
                            <td>{kegRental?.user?.full_name || '-'}</td>
                            <td>{dateFormat(kegRental?.created_at) || '-'}</td>
                            <td>{kegRental?.no_of_kegs || '-'}</td>
                            <td>{kegRental?.keg_rental_duration || '-'}</td>
                            <td>${kegRental?.deposit_amount || '0'}</td>
                            <td
                              className={`text-capitalize ${
                                kegRental?.status == 0
                                  ? 'colorYellowDark'
                                  : kegRental?.status == 1
                                  ? 'colorGreen'
                                  : 'colorRed'
                              }`}
                            >
                              {kegRental?.status_detail || '-'}
                            </td>
                            <td>
                              <CustomTableActionDropdown
                                actions={[
                                  {
                                    icon: <LuEye />,
                                    label: 'View',
                                    onClick: () => {
                                      navigate(
                                        `/keg-rental-management/keg-rental-details/${kegRental?.id}`
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
export default withFilters(KegRentalManagement);
