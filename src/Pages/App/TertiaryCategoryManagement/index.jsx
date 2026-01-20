import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import GetTertiaryCategories from './Services/GetTertiaryCategories';
import ChangeTertiaryCategoryStatus from './Services/ChangeTertiaryCategoryStatus';

import useModalStore from '../../../Store/ModalStore';

import withFilters from '../../../HOC/withFilters ';
import { dateFormat } from '../../../Utils/Utils';

import { showToast } from '../../../Components/CustomToast';
import PageTitle from '../../../Components/PageTitle';
import CustomCard from '../../../Components/CustomCard';
import CustomTable from '../../../Components/CustomTable';
import CustomFilters from '../../../Components/CustomFilters';
import StatusDropdown from '../../../Components/StatisDropdown';
import CustomButton from '../../../Components/CustomButton';
import CustomTableActionDropdown from '../../../Components/CustomTableActionDropdown';

import { LuEye, LuPencil } from 'react-icons/lu';

const headers = [
  { id: 1, key: 'sNo', title: 'S.No' },
  { id: 2, key: 'tertiaryCategory', title: 'Tertiary Category' },
  { id: 4, key: 'addedOn', title: 'Added On' },
  { id: 5, key: 'status', title: 'Status' },
  { id: 6, key: 'action', title: 'Action' },
];

// eslint-disable-next-line react-refresh/only-export-components
const TertiaryCategoryManagement = ({ filters, setFilters, pagination }) => {
  const navigate = useNavigate();
  const { showModal, closeModal } = useModalStore();
  const queryClient = useQueryClient();

  const {
    data: tertiaryCategoriesData,
    isLoading: isTertiaryCategoriesLoading,
    isError: isTertiaryCategoriesError,
    error: tertiaryCategoriesError,
  } = useQuery({
    queryKey: ['tertiaryCategories', { pagination, filters }],
    queryFn: () => GetTertiaryCategories(filters, pagination),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
    retry: 2,
  });

  console.log('tertiaryCategoriesData', tertiaryCategoriesData);

  const { mutateAsync: changeStatusMutation } = useMutation({
    mutationFn: ({ id }) => ChangeTertiaryCategoryStatus(id),
    onSuccess: ({ message }) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message: message || 'Tertiary Category status changed successfully!',
          continueText: 'Ok',
          onContinue: () => {
            closeModal();
          },
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['tertiaryCategories', { pagination, filters }],
      });
    },
    onError: (error) => {
      showToast(error?.message || 'Status change failed', 'error');
    },
  });

  const handleChangeStatus = (id, status) => {
    const title =
      status == 1 ? 'Inactivate Tertiary Category?' : 'Activate Tertiary Category?';
    const message =
      status == 1
        ? 'Are you sure you want to inactivate the Tertiary Category?'
        : 'Are you sure you want to activate the Tertiary Category?';
    showModal({
      type: 'question',
      modalProps: {
        title: title,
        message: message,
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          await changeStatusMutation({ id });
        },
      },
    });
  };

  return (
    <div className="tertiaryCategoryManagementScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle title="Tertiary Category Management" />
        </div>
        <div className="col-12 col-xl-6 text-end">
          <CustomButton
            text="Add Tertiary Category"
            to={'/tertiary-category-management/add-tertiary-category'}
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
                    pagination={tertiaryCategoriesData?.meta}
                  >
                    <CustomTable
                      headers={headers}
                      loading={isTertiaryCategoriesLoading}
                      rows={filters.per_page}
                      className="mt-4"
                    >
                      <tbody>
                        {isTertiaryCategoriesError ||
                          (tertiaryCategoriesData?.data?.length == 0 && (
                            <tr>
                              <td
                                colSpan={headers?.length}
                                className="text-center"
                              >
                                {tertiaryCategoriesError?.message || 'No data found'}
                              </td>
                            </tr>
                          ))}
                        {tertiaryCategoriesData?.data?.map(
                          (tertiaryCategories, index) => (
                            <tr key={index}>
                              <td>
                                {index + 1 < 10 ? `0${index + 1}` : index + 1}
                              </td>
                              <td>{tertiaryCategories?.name || '-'}</td>
                              <td>
                                {dateFormat(tertiaryCategories?.created_at) || '-'}
                              </td>
                              <td>
                                <StatusDropdown
                                  selected={
                                    tertiaryCategories?.is_active == 0
                                      ? { value: 0, label: 'Inactive' }
                                      : tertiaryCategories?.is_active == 1
                                      ? { value: 1, label: 'Active' }
                                      : { value: 2, label: 'Pending' }
                                  }
                                  options={[
                                    {
                                      value:
                                        tertiaryCategories?.is_active == 1 ? 0 : 1,
                                      label:
                                        tertiaryCategories?.is_active == 1
                                          ? 'Inactive'
                                          : 'Active',
                                      onClick: () => {
                                        handleChangeStatus(
                                          tertiaryCategories?.id,
                                          tertiaryCategories?.is_active
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
                                          `/tertiary-category-management/tertiary-category-details/${tertiaryCategories?.id}`
                                        );
                                      },
                                    },
                                    {
                                      icon: <LuPencil />,
                                      label: 'Edit',
                                      onClick: () => {
                                        navigate(
                                          `/tertiary-category-management/edit-tertiary-category/${tertiaryCategories?.id}`
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
export default withFilters(TertiaryCategoryManagement);
