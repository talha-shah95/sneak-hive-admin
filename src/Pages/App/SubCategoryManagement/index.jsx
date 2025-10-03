import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import GetSubCategories from './Services/GetSubCategories';
import ChangeSubCategoryStatus from './Services/ChangeSubCategoryStatus';

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
  { id: 2, key: 'subCategoryName', title: 'Sub Category Name' },
  { id: 4, key: 'addedOn', title: 'Added On' },
  { id: 5, key: 'status', title: 'Status' },
  { id: 6, key: 'action', title: 'Action' },
];

// eslint-disable-next-line react-refresh/only-export-components
const SubCategoryManagement = ({ filters, setFilters, pagination }) => {
  const navigate = useNavigate();
  const { showModal, closeModal } = useModalStore();
  const queryClient = useQueryClient();

  const {
    data: subCategoriesData,
    isLoading: isSubCategoriesLoading,
    isError: isSubCategoriesError,
    error: subCategoriesError,
  } = useQuery({
    queryKey: ['subCategories', pagination, filters],
    queryFn: () => GetSubCategories(filters, pagination),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
    retry: 2,
  });

  const { mutateAsync: changeStatusMutation } = useMutation({
    mutationFn: (id) => ChangeSubCategoryStatus(id),
    onSuccess: ({ message }) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message: message || 'Sub Category status changed successfully!',
          continueText: 'Ok',
          onContinue: () => {
            closeModal();
          },
        },
      });
      queryClient.invalidateQueries({ queryKey: ['subCategories'] });
    },
    onError: (error) => {
      showToast(error?.message || 'Status change failed', 'error');
    },
  });

  const handleChangeStatus = (id, status) => {
    const title =
      status == 1 ? 'Deactivate Sub Category?' : 'Activate Sub Category?';
    const message =
      status == 1
        ? 'Are you sure you want to deactivate the Sub Category?'
        : 'Are you sure you want to activate the Sub Category?';
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
    <div className="subCategoryManagementScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle title="Sub Category Management" />
        </div>
        <div className="col-12 col-xl-6 text-end">
          <CustomButton
            text="Add Sub Category"
            to={'/sub-category-management/add-sub-category'}
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
                    pagination={subCategoriesData?.meta}
                  >
                    <CustomTable
                      headers={headers}
                      loading={isSubCategoriesLoading}
                      rows={filters.per_page}
                      className="mt-4"
                    >
                      <tbody>
                        {isSubCategoriesError ||
                          (subCategoriesData?.data?.length == 0 && (
                            <tr>
                              <td
                                colSpan={headers?.length}
                                className="text-center"
                              >
                                {subCategoriesError?.message || 'No data found'}
                              </td>
                            </tr>
                          ))}
                        {subCategoriesData?.data?.map(
                          (subCategories, index) => (
                            <tr key={index}>
                              <td>
                                {index + 1 < 10 ? `0${index + 1}` : index + 1}
                              </td>
                              <td>{subCategories?.name || '-'}</td>
                              <td>
                                {dateFormat(subCategories?.created_at) || '-'}
                              </td>
                              <td>
                                <StatusDropdown
                                  selected={
                                    subCategories?.is_active == 0
                                      ? { value: 0, label: 'Inactive' }
                                      : subCategories?.is_active == 1
                                      ? { value: 1, label: 'Active' }
                                      : { value: 2, label: 'Pending' }
                                  }
                                  options={[
                                    {
                                      value:
                                        subCategories?.is_active == 1 ? 0 : 1,
                                      label:
                                        subCategories?.is_active == 1
                                          ? 'Inactive'
                                          : 'Active',
                                      onClick: () => {
                                        handleChangeStatus(
                                          subCategories?.id,
                                          subCategories?.is_active
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
                                          `/sub-category-management/sub-category-details/${subCategories?.id}`
                                        );
                                      },
                                    },
                                    {
                                      icon: <LuPencil />,
                                      label: 'Edit',
                                      onClick: () => {
                                        navigate(
                                          `/sub-category-management/edit-sub-category/${subCategories?.id}`
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
export default withFilters(SubCategoryManagement);
