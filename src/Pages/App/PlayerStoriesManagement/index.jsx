import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import GetPlayerStories from './Services/GetPlayerStories';
import ChangePlayerStoryStatus from './Services/ChangePlayerStoryStatus';

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
  { id: 2, key: 'storyTitle', title: 'Story Title' },
  { id: 3, key: 'category', title: 'Category' },
  { id: 4, key: 'uploadDate', title: 'Upload Date' },
  { id: 5, key: 'status', title: 'Status' },
  { id: 6, key: 'action', title: 'Action' },
];

// eslint-disable-next-line react-refresh/only-export-components
const PlayerStoriesManagement = ({ filters, setFilters, pagination }) => {
  const navigate = useNavigate();
  const { showModal, closeModal } = useModalStore();
  const queryClient = useQueryClient();

  const {
    data: playerStoriesData,
    isLoading: isPlayerStoriesLoading,
    isError: isPlayerStoriesError,
    error: playerStoriesError,
  } = useQuery({
    queryKey: ['playerStories', pagination, filters],
    queryFn: () => GetPlayerStories(filters, pagination),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
    retry: 2,
  });

  const { mutateAsync: changeStatusMutation } = useMutation({
    mutationFn: (id) => ChangePlayerStoryStatus(id),
    onSuccess: ({ message }) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message: message || 'Player Story status changed successfully!',
          continueText: 'Ok',
          onContinue: () => {
            closeModal();
          },
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['playerStories', 'playerStoryDetails'],
      });
    },
    onError: (error) => {
      showToast(error?.message || 'Status change failed', 'error');
    },
  });

  const handleChangeStatus = (id, status) => {
    const title =
      status == 1 ? 'Deactivate Player Story?' : 'Activate Player Story?';
    const message =
      status == 1
        ? 'Are you sure you want to deactivate the Player Story?'
        : 'Are you sure you want to activate the Player Story?';
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
    <div className="playerStoriesManagementScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle title="Player Stories Management" />
        </div>
        <div className="col-12 col-xl-6 text-end">
          <CustomButton
            text="Add Player Story"
            to={'/player-stories-management/add-player-story'}
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
                    pagination={playerStoriesData?.meta}
                  >
                    <CustomTable
                      headers={headers}
                      loading={isPlayerStoriesLoading}
                      rows={filters.per_page}
                      className="mt-4"
                    >
                      <tbody>
                        {isPlayerStoriesError ||
                          (playerStoriesData?.data?.length == 0 && (
                            <tr>
                              <td
                                colSpan={headers?.length}
                                className="text-center"
                              >
                                {playerStoriesError?.message || 'No data found'}
                              </td>
                            </tr>
                          ))}
                        {playerStoriesData?.data?.map((playerStory, index) => (
                          <tr key={index}>
                            <td>
                              {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </td>
                            <td>{playerStory?.story_title || '-'}</td>
                            <td>{playerStory?.category?.name || '-'}</td>
                            <td>
                              {dateFormat(playerStory?.created_at) || '-'}
                            </td>
                            <td>
                              <StatusDropdown
                                selected={
                                  playerStory?.is_active == 0
                                    ? { value: 0, label: 'Inactive' }
                                    : playerStory?.is_active == 1
                                    ? { value: 1, label: 'Active' }
                                    : { value: 2, label: 'Pending' }
                                }
                                options={[
                                  {
                                    value: playerStory?.is_active == 1 ? 0 : 1,
                                    label:
                                      playerStory?.is_active == 1
                                        ? 'Inactive'
                                        : 'Active',
                                    onClick: () => {
                                      handleChangeStatus(
                                        playerStory?.id,
                                        playerStory?.is_active
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
                                        `/player-stories-management/player-story-details/${playerStory?.id}`
                                      );
                                    },
                                  },
                                  {
                                    icon: <LuPencil />,
                                    label: 'Edit',
                                    onClick: () => {
                                      navigate(
                                        `/player-stories-management/edit-player-story/${playerStory?.id}`
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
export default withFilters(PlayerStoriesManagement);
