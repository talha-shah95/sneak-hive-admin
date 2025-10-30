import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import GetReleaseCalendars from './Services/GetReleaseCalendars';
import ChangeReleaseCalendarStatus from './Services/ChangeReleaseCalendarStatus';

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
import CustomButton from '../../../Components/CustomButton';

import { LuEye, LuPencil } from 'react-icons/lu';

const headers = [
  { id: 1, key: 'sNo', title: 'S.No' },
  { id: 2, key: 'calendarTitle', title: 'Calendar Title' },
  { id: 3, key: 'addedOn', title: 'Added On' },
  { id: 4, key: 'status', title: 'Status' },
  { id: 5, key: 'action', title: 'Action' },
];

// eslint-disable-next-line react-refresh/only-export-components
const ReleaseCalendarManagement = ({ filters, setFilters, pagination }) => {
  const navigate = useNavigate();
  const { showModal, closeModal } = useModalStore();
  const queryClient = useQueryClient();

  const {
    data: releaseCalendarData,
    isLoading: isReleaseCalendarLoading,
    isError: isReleaseCalendarError,
    error: releaseCalendarError,
  } = useQuery({
    queryKey: ['releaseCalendar', { pagination, filters }],
    queryFn: () => GetReleaseCalendars(filters, pagination),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
    retry: 2,
  });

  const { mutateAsync: changeStatusMutation } = useMutation({
    mutationFn: (id) => ChangeReleaseCalendarStatus(id),
    onSuccess: ({ message }) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message: message || 'Release Calendar status changed successfully!',
          continueText: 'Ok',
          onContinue: () => {
            closeModal();
          },
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['releaseCalendar', { pagination, filters }],
      });
    },
    onError: (error) => {
      showToast(error?.message || 'Status change failed', 'error');
    },
  });

  const handleChangeStatus = (id, status) => {
    const title =
      status == 1
        ? 'Inactivate Release Calendar?'
        : 'Activate Release Calendar?';
    const message =
      status == 1
        ? 'Are you sure you want to inactivate the Release Calendar?'
        : 'Are you sure you want to activate the Release Calendar?';
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
    <div className="articleManagementScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle title="Release Management" />
        </div>
        <div className="col-12 col-xl-6 text-end">
          <CustomButton
            text="Add Release Calendar"
            to={'/release-calendar-management/add-release-calendar'}
            className="w-auto d-inline-block"
            variant="secondary"
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
                    pagination={releaseCalendarData?.meta}
                  >
                    <CustomTable
                      headers={headers}
                      loading={isReleaseCalendarLoading}
                      rows={filters.per_page}
                      className="mt-4"
                    >
                      <tbody>
                        {isReleaseCalendarError ||
                          (releaseCalendarData?.data?.length == 0 && (
                            <tr>
                              <td
                                colSpan={headers?.length}
                                className="text-center"
                              >
                                {releaseCalendarError?.message ||
                                  'No data found'}
                              </td>
                            </tr>
                          ))}
                        {releaseCalendarData?.data?.map(
                          (releaseCalendar, index) => (
                            <tr key={index}>
                              <td>
                                {index + 1 < 10 ? `0${index + 1}` : index + 1}
                              </td>
                              <td>{releaseCalendar?.calender_title || '-'}</td>
                              <td>
                                {dateFormat(releaseCalendar?.created_at) || '-'}
                              </td>
                              <td>
                                <StatusDropdown
                                  selected={
                                    releaseCalendar?.is_active == 0
                                      ? { value: 0, label: 'Inactive' }
                                      : releaseCalendar?.is_active == 1
                                      ? { value: 1, label: 'Active' }
                                      : { value: 2, label: 'Pending' }
                                  }
                                  options={[
                                    {
                                      value:
                                        releaseCalendar?.is_active == 1 ? 0 : 1,
                                      label:
                                        releaseCalendar?.is_active == 1
                                          ? 'Inactive'
                                          : 'Active',
                                      onClick: () => {
                                        handleChangeStatus(
                                          releaseCalendar?.id,
                                          releaseCalendar?.is_active
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
                                          `/release-calendar-management/release-calendar-details/${releaseCalendar?.id}`
                                        );
                                      },
                                    },
                                    {
                                      icon: <LuPencil />,
                                      label: 'Edit',
                                      onClick: () => {
                                        navigate(
                                          `/release-calendar-management/edit-release-calendar/${releaseCalendar?.id}`
                                        );
                                      },
                                    },
                                  ]}
                                />
                              </td>
                            </tr>
                          )
                        )}
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
export default withFilters(ReleaseCalendarManagement);
