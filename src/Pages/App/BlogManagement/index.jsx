import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import GetUsers from './Services/GetUsers';
import ChangeUserStatus from './Services/ChangeUserStatus';

import useModalStore from '../../../Store/ModalStore';

import withFilters from '../../../HOC/withFilters ';
import { dateFormat } from '../../../Utils/Utils';

import { showToast } from '../../../Components/CustomToast';
import PageTitle from '../../../Components/PageTitle';
import CustomCard from '../../../Components/CustomCard';
import CustomTable from '../../../Components/CustomTable';
import CustomFilters from '../../../Components/CustomFilters';
import StatusDropdown from '../../../Components/StatisDropdown';
import CustomTableActionDropdown from '../../../Components/CustomTableActionDropdown';

import { LuEye } from 'react-icons/lu';

const headers = [
  { id: 1, key: 'sNo', title: 'S.No' },
  { id: 2, key: 'firstName', title: 'First Name' },
  { id: 3, key: 'lastName', title: 'Last Name' },
  { id: 4, key: 'emailAddress', title: 'Email Address' },
  { id: 5, key: 'registrationDate', title: 'Registration Date' },
  { id: 6, key: 'status', title: 'Status' },
  { id: 7, key: 'action', title: 'Action' },
];

// eslint-disable-next-line react-refresh/only-export-components
const UserManagement = ({ filters, setFilters, pagination }) => {
  const navigate = useNavigate();
  const { showModal, closeModal } = useModalStore();
  const queryClient = useQueryClient();

  const {
    data: blogsData,
    isLoading: isBlogsLoading,
    isError: isBlogsError,
    error: blogsError,
  } = useQuery({
    queryKey: ['blogs', pagination, filters],
    queryFn: () => GetBlogs(filters, pagination),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
    retry: 2,
  });

  return (
    <div className="blogManagementScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle title="Blog Management" />
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
                    pagination={blogsData?.meta}
                  >
                    <CustomTable
                      headers={headers}
                      loading={isBlogsLoading}
                      rows={filters.per_page}
                      className="mt-4"
                    >
                      <tbody>
                        {isBlogsError ||
                          (blogsData?.data?.length == 0 && (
                            <tr>
                              <td
                                colSpan={headers?.length}
                                className="text-center"
                              >
                                {blogsError?.message || 'No data found'}
                              </td>
                            </tr>
                          ))}
                        {blogsData?.data?.map((blogs, index) => (
                          <tr key={index}>
                            <td>
                              {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </td>
                            <td>{blogs?.title || '-'}</td>
                            <td>{blogs?.last_name || '-'}</td>
                            <td>{blogs?.email || '-'}</td>
                            <td>{dateFormat(blogs?.created_at) || '-'}</td>
                            <td>
                              <CustomTableActionDropdown
                                actions={[
                                  {
                                    icon: <LuEye />,
                                    label: 'View',
                                    onClick: () => {
                                      navigate(
                                        `/user-management/details/${blogs?.id}`
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
export default withFilters(UserManagement);
