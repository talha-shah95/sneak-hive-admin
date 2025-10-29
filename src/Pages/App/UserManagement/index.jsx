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
    data: usersData,
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
  } = useQuery({
    queryKey: ['users', { pagination, filters }],
    queryFn: () => GetUsers(filters, pagination),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
    retry: 2,
  });

  const { mutateAsync: changeStatusMutation } = useMutation({
    mutationFn: (id) => ChangeUserStatus(id),
    onSuccess: ({ message }) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message: message || 'User has been activated successfully!',
          continueText: 'Ok',
          onContinue: () => {
            closeModal();
          },
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['users', { pagination, filters }],
      });
    },
    onError: (error) => {
      showToast(error?.message || 'Status change failed', 'error');
    },
  });

  const handleChangeStatus = (id, status) => {
    const title = status == 1 ? 'Inactivate User?' : 'Activate User?';
    const message =
      status == 1
        ? 'Are you sure you want to inactive this User?'
        : 'Are you sure you want to active this User?';
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
    <div className="userManagementScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle title="User Management" />
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
                    selectOptions={[
                      {
                        heading: 'Status',
                        title: 'status',
                        options: [
                          { value: '', label: 'All' },
                          { value: '1', label: 'Active' },
                          { value: '0', label: 'Inactive' },
                        ],
                      },
                    ]}
                    pagination={usersData?.meta}
                  >
                    <CustomTable
                      headers={headers}
                      loading={isUsersLoading}
                      rows={filters.per_page}
                      className="mt-4"
                    >
                      <tbody>
                        {isUsersError ||
                          (usersData?.data?.length == 0 && (
                            <tr>
                              <td
                                colSpan={headers?.length}
                                className="text-center"
                              >
                                {usersError?.message || 'No data found'}
                              </td>
                            </tr>
                          ))}
                        {usersData?.data?.map((users, index) => (
                          <tr key={index}>
                            <td>
                              {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </td>
                            <td>{users?.first_name || '-'}</td>
                            <td>{users?.last_name || '-'}</td>
                            <td>{users?.email || '-'}</td>
                            <td>{dateFormat(users?.created_at) || '-'}</td>
                            <td>
                              <StatusDropdown
                                selected={
                                  users?.is_active == 0
                                    ? { value: 0, label: 'Inactive' }
                                    : users?.is_active == 1
                                    ? { value: 1, label: 'Active' }
                                    : { value: 2, label: 'Pending' }
                                }
                                options={[
                                  {
                                    value: users?.is_active == 1 ? 0 : 1,
                                    label:
                                      users?.is_active == 1
                                        ? 'Inactive'
                                        : 'Active',
                                    onClick: () => {
                                      handleChangeStatus(
                                        users?.id,
                                        users?.is_active
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
                                        `/user-management/details/${users?.id}`
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
