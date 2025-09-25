import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import GetAdLogs from './Services/GetAdLogs';

import withFilters from '../../../../HOC/withFilters ';
import { dateFormat } from '../../../../Utils/Utils';
import { LuEye } from 'react-icons/lu';
import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomTable from '../../../../Components/CustomTable';
import CustomFilters from '../../../../Components/CustomFilters';
import CustomTableActionDropdown from '../../../../Components/CustomTableActionDropdown';
import CustomButton from '../../../../Components/CustomButton';

const headers = [
  { id: 1, key: 'sNo', title: 'S.No' },
  { id: 2, key: 'adTitle', title: 'Advertisement Title' },
  { id: 3, key: 'emailAddress', title: 'Email Address' },
  { id: 4, key: 'requestDate', title: 'Request Date' },
  { id: 5, key: 'status', title: 'Status' },
  { id: 6, key: 'action', title: 'Action' },
];

// eslint-disable-next-line react-refresh/only-export-components
const AdLogs = ({ filters, setFilters, pagination }) => {
  const navigate = useNavigate();
  const {
    data: adLogsData,
    isLoading: isAdLogsLoading,
    isError: isAdLogsError,
    error: adLogsError,
  } = useQuery({
    queryKey: ['adLogs', pagination, filters],
    queryFn: () => GetAdLogs(filters, pagination),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
    retry: 2,
  });

  return (
    <div className="adLogsManagementScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle title="Ad Logs" />
        </div>
        <div className="col-12 col-xl-6 text-end">
          <CustomButton
            text="Ad Request"
            to={'/ad-logs/ad-request'}
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
                    pagination={adLogsData?.meta}
                  >
                    <CustomTable
                      headers={headers}
                      loading={isAdLogsLoading}
                      rows={filters.per_page}
                    >
                      <tbody>
                        {isAdLogsError ||
                          (adLogsData?.data?.length == 0 && (
                            <tr>
                              <td
                                colSpan={headers?.length}
                                className="text-center"
                              >
                                {adLogsError?.message || 'No data found'}
                              </td>
                            </tr>
                          ))}
                        {adLogsData?.data?.map((adLogs, index) => (
                          <tr key={index}>
                            <td>
                              {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </td>
                            <td>{adLogs?.title || '-'}</td>
                            <td>{adLogs?.email || '-'}</td>
                            <td>{dateFormat(adLogs?.created_at) || '-'}</td>
                            <td
                              className={`text-capitalize ${
                                adLogs?.status == 0
                                  ? 'colorYellowDark'
                                  : adLogs?.status == 1
                                  ? 'colorGreen'
                                  : 'colorRed'
                              }`}
                            >
                              {adLogs?.status_detail || '-'}
                            </td>
                            <td>
                              <CustomTableActionDropdown
                                actions={[
                                  {
                                    icon: <LuEye />,
                                    label: 'View',
                                    onClick: () => {
                                      navigate(
                                        `/ad-logs/ad-details/${adLogs?.id}`
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
export default withFilters(AdLogs);
