import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import GetBrands from './Services/GetBrands';
import ChangeBrandStatus from './Services/ChangeBrandStatus';

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

import { LuEye } from 'react-icons/lu';

const headers = [
  { id: 1, key: 'sNo', title: 'S.No' },
  { id: 2, key: 'brand', title: 'Brand' },
  { id: 3, key: 'uploadDate', title: 'Upload Date' },
  { id: 4, key: 'status', title: 'Status' },
  { id: 5, key: 'action', title: 'Action' },
];

// eslint-disable-next-line react-refresh/only-export-components
const BrandManagement = ({ filters, setFilters, pagination }) => {
  const navigate = useNavigate();
  const { showModal, closeModal } = useModalStore();
  const queryClient = useQueryClient();

  const {
    data: brandsData,
    isLoading: isBrandsLoading,
    isError: isBrandsError,
    error: brandsError,
  } = useQuery({
    queryKey: ['brands', pagination, filters],
    queryFn: () => GetBrands(filters, pagination),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
    retry: 2,
  });

  const { mutateAsync: changeStatusMutation } = useMutation({
    mutationFn: (id) => ChangeBrandStatus(id),
    onSuccess: ({ message }) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message: message || 'Brand has been activated successfully!',
          continueText: 'Okay',
          onContinue: () => {
            closeModal();
          },
        },
      });
      queryClient.invalidateQueries({ queryKey: ['brands', 'brandDetails'] });
    },
    onError: (error) => {
      showToast(error?.message || 'Status change failed', 'error');
    },
  });

  const handleChangeStatus = (id, status) => {
    const title = status == 1 ? 'Deactivate Brand?' : 'Activate Brand?';
    const message =
      status == 1
        ? 'Are you sure you want to deactivate the Brand?'
        : 'Are you sure you want to activate the Brand?';
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
    <div className="brandManagementScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle title="Brand Management" />
        </div>
        <div className="col-12 col-xl-6 text-end">
          <CustomButton
            text="Add New Brand"
            to={'/brand-management/add-brand'}
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
                    pagination={brandsData?.meta}
                  >
                    <CustomTable
                      headers={headers}
                      loading={isBrandsLoading}
                      rows={filters.per_page}
                      className="mt-4"
                    >
                      <tbody>
                        {isBrandsError ||
                          (brandsData?.data?.length == 0 && (
                            <tr>
                              <td
                                colSpan={headers?.length}
                                className="text-center"
                              >
                                {brandsError?.message || 'No data found'}
                              </td>
                            </tr>
                          ))}
                        {brandsData?.data?.map((brand, index) => (
                          <tr key={index}>
                            <td>
                              {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </td>
                            <td>{brand?.name || '-'}</td>
                            <td>{dateFormat(brand?.created_at) || '-'}</td>
                            <td>
                              <StatusDropdown
                                selected={
                                  brand?.is_active == 0
                                    ? { value: 0, label: 'Inactive' }
                                    : brand?.is_active == 1
                                    ? { value: 1, label: 'Active' }
                                    : { value: 2, label: 'Pending' }
                                }
                                options={[
                                  {
                                    value: brand?.is_active == 1 ? 0 : 1,
                                    label:
                                      brand?.is_active == 1
                                        ? 'Inactive'
                                        : 'Active',
                                    onClick: () => {
                                      handleChangeStatus(
                                        brand?.id,
                                        brand?.is_active
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
                                        `/brand-management/brand-details/${brand?.id}`
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
export default withFilters(BrandManagement);
