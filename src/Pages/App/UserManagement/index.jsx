import React from 'react';
import { Link } from 'react-router-dom';

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
  // const navigate = useNavigate();
  const { showModal, closeModal } = useModalStore();
  const queryClient = useQueryClient();

  const {
    data: usersData,
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
  } = useQuery({
    queryKey: ['users', pagination, filters],
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
    const title = status == 1 ? 'Deactivate User?' : 'Activate User?';
    const message =
      status == 1
        ? 'Are you sure you want to deactivate the User?'
        : 'Are you sure you want to activate the User?';
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

  console.log('usersData', usersData);

  // const mockData = [
  //   {
  //     id: 1,
  //     first_name: 'John',
  //     last_name: 'Doe',
  //     email: 'john.doe@example.com',
  //     created_at: '2021-01-01',
  //     status: 1,
  //   },
  //   {
  //     id: 2,
  //     first_name: 'Jane',
  //     last_name: 'Doe',
  //     email: 'jane.doe@example.com',
  //     created_at: '2021-01-02',
  //     status: 0,
  //   },
  //   {
  //     id: 3,
  //     first_name: 'Jim',
  //     last_name: 'Beam',
  //     email: 'jim.beam@example.com',
  //     created_at: '2021-01-03',
  //     status: 1,
  //   },
  // ];

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
                                  users?.status == 0
                                    ? { value: 0, label: 'Inactive' }
                                    : users?.status == 1
                                    ? { value: 1, label: 'Active' }
                                    : { value: 2, label: 'Pending' }
                                }
                                options={[
                                  {
                                    value: users?.status == 1 ? 0 : 1,
                                    label:
                                      users?.status == 1
                                        ? 'Inactive'
                                        : 'Active',
                                    onClick: () => {
                                      handleChangeStatus(
                                        users?.id,
                                        users?.status
                                      );
                                    },
                                  },
                                ]}
                              />
                            </td>
                            <td>
                              <Link
                                className="colorSecondary d-flex align-items-center gap-2"
                                to={`/user-management/user-details/${users?.id}`}
                              >
                                <LuEye />
                                View
                              </Link>
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
