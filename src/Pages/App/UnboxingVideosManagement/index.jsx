import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import GetVideos from './Services/GetVideos';
import ChangeVideoStatus from './Services/ChangeVideoStatus';

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
  { id: 2, key: 'videoTtile', title: 'Video Title' },
  { id: 3, key: 'brand', title: 'Brand' },
  { id: 4, key: 'uploadDate', title: 'Upload Date' },
  { id: 5, key: 'status', title: 'Status' },
  { id: 6, key: 'action', title: 'Action' },
];

// eslint-disable-next-line react-refresh/only-export-components
const UnboxingVideosManagement = ({ filters, setFilters, pagination }) => {
  const navigate = useNavigate();
  const { showModal, closeModal } = useModalStore();
  const queryClient = useQueryClient();

  const {
    data: unboxingVideosData,
    isLoading: isUnboxingVideosLoading,
    isError: isUnboxingVideosError,
    error: unboxingVideosError,
  } = useQuery({
    queryKey: ['unboxingVideos', { pagination, filters }],
    queryFn: () => GetVideos(filters, pagination),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
    retry: 2,
  });

  const { mutateAsync: changeStatusMutation } = useMutation({
    mutationFn: (id) => ChangeVideoStatus(id),
    onSuccess: ({ message }) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message: message || 'Video status changed successfully!',
          continueText: 'Ok',
          onContinue: () => {
            closeModal();
          },
        },
      });
      queryClient.invalidateQueries({ queryKey: ['videos', 'videoDetails'] });
      queryClient.invalidateQueries({
        queryKey: ['unboxingVideos', { pagination, filters }],
      });
    },
    onError: (error) => {
      showToast(error?.message || 'Status change failed', 'error');
    },
  });

  const handleChangeStatus = (id, status) => {
    const title = status == 1 ? 'Inactivate Video?' : 'Activate Video?';
    const message =
      status == 1
        ? 'Are you sure you want to inactivate the Video?'
        : 'Are you sure you want to activate the Video?';
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
    <div className="unboxingVideosManagementScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle title="Unboxing Videos" />
        </div>
        <div className="col-12 col-xl-6 text-end">
          <CustomButton
            text="Add New Video"
            to={'/unboxing-videos-management/add-video'}
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
                    pagination={unboxingVideosData?.meta}
                  >
                    <CustomTable
                      headers={headers}
                      loading={isUnboxingVideosLoading}
                      rows={filters.per_page}
                      className="mt-4"
                    >
                      <tbody>
                        {isUnboxingVideosError ||
                          (unboxingVideosData?.data?.length == 0 && (
                            <tr>
                              <td
                                colSpan={headers?.length}
                                className="text-center"
                              >
                                {unboxingVideosError?.message ||
                                  'No data found'}
                              </td>
                            </tr>
                          ))}
                        {unboxingVideosData?.data?.map(
                          (unboxingVideo, index) => (
                            <tr key={index}>
                              <td>
                                {index + 1 < 10 ? `0${index + 1}` : index + 1}
                              </td>
                              <td>{unboxingVideo?.title || '-'}</td>
                              <td>{unboxingVideo?.brand?.name || '-'}</td>
                              <td>
                                {dateFormat(unboxingVideo?.created_at) || '-'}
                              </td>
                              <td>
                                <StatusDropdown
                                  selected={
                                    unboxingVideo?.is_active == 0
                                      ? { value: 0, label: 'Inactive' }
                                      : unboxingVideo?.is_active == 1
                                      ? { value: 1, label: 'Active' }
                                      : { value: 2, label: 'Pending' }
                                  }
                                  options={[
                                    {
                                      value:
                                        unboxingVideo?.is_active == 1 ? 0 : 1,
                                      label:
                                        unboxingVideo?.is_active == 1
                                          ? 'Inactive'
                                          : 'Active',
                                      onClick: () => {
                                        handleChangeStatus(
                                          unboxingVideo?.id,
                                          unboxingVideo?.is_active
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
                                          `/unboxing-videos-management/video-details/${unboxingVideo?.id}`
                                        );
                                      },
                                    },
                                    {
                                      icon: <LuPencil />,
                                      label: 'Edit',
                                      onClick: () => {
                                        navigate(
                                          `/unboxing-videos-management/edit-video/${unboxingVideo?.id}`
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
export default withFilters(UnboxingVideosManagement);
