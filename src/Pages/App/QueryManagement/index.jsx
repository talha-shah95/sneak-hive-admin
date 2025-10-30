import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import GetQueries from './Services/GetQueries';


import withFilters from '../../../HOC/withFilters ';
import { dateFormat } from '../../../Utils/Utils';

import PageTitle from '../../../Components/PageTitle';
import CustomCard from '../../../Components/CustomCard';
import CustomTable from '../../../Components/CustomTable';
import CustomFilters from '../../../Components/CustomFilters';
import CustomTableActionDropdown from '../../../Components/CustomTableActionDropdown';

import { LuEye } from 'react-icons/lu';

const headers = [
  { id: 1, key: 'sNo', title: 'S.No' },
  { id: 2, key: 'fullName', title: 'Full Name' },
  { id: 3, key: 'userType', title: 'User Type' },
  { id: 4, key: 'emailAddress', title: 'Email Address' },
  { id: 5, key: 'receivedOn', title: 'Received On' },
  { id: 6, key: 'action', title: 'Action' },
];

// eslint-disable-next-line react-refresh/only-export-components
const QueryManagement = ({ filters, setFilters, pagination }) => {
  const navigate = useNavigate();

  const {
    data: queriesData,
    isLoading: isQueriesLoading,
    isError: isQueriesError,
    error: queriesError,
  } = useQuery({
    queryKey: ['queries', { pagination, filters }],
    queryFn: () => GetQueries(filters, pagination),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
    retry: 2,
  });

  return (
    <div className="queryManagementScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle title="Query Management" />
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
                    //     heading: 'Status',
                    //     title: 'status',
                    //     options: [
                    //       { value: '', label: 'All' },
                    //       { value: '1', label: 'Active' },
                    //       { value: '0', label: 'Inactive' },
                    //     ],
                    //   },
                    // ]}
                    pagination={queriesData?.meta}
                  >
                    <CustomTable
                      headers={headers}
                      loading={isQueriesLoading}
                      rows={filters.per_page}
                      className="mt-4"
                    >
                      <tbody>
                        {isQueriesError ||
                          (queriesData?.data?.length == 0 && (
                            <tr>
                              <td
                                colSpan={headers?.length}
                                className="text-center"
                              >
                                {queriesError?.message || 'No data found'}
                              </td>
                            </tr>
                          ))}
                        {queriesData?.data?.map((query, index) => (
                          <tr key={index}>
                            <td>
                              {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </td>
                            <td>{query?.name || '-'}</td>
                            <td>{query?.user_type || '-'}</td>
                            <td>{query?.email || '-'}</td>
                            <td>{dateFormat(query?.created_at) || '-'}</td>
                            <td>
                              <CustomTableActionDropdown
                                actions={[
                                  {
                                    icon: <LuEye />,
                                    label: 'View',
                                    onClick: () => {
                                      navigate(
                                        `/query-management/query-details/${query?.id}`
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
export default withFilters(QueryManagement);
