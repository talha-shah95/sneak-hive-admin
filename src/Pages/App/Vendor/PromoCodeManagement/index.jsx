import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import useModalStore from '../../../../Store/ModalStore';

import GetPromoCodes from './Services/GetPromoCodes';
import ChangePromoCodeStatus from './Services/ChangePromoCodeStatus';

import withFilters from '../../../../HOC/withFilters ';
import { dateFormat } from '../../../../Utils/Utils';

import { LuEye, LuPencil } from 'react-icons/lu';

import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomButton from '../../../../Components/CustomButton';
import CustomTable from '../../../../Components/CustomTable';
import CustomTableActionDropdown from '../../../../Components/CustomTableActionDropdown';
import StatusDropdown from '../../../../Components/StatisDropdown';
import CustomFilters from '../../../../Components/CustomFilters';
import { showToast } from '../../../../Components/CustomToast';

// const timePeriods = [
//   { value: 'all', label: 'All' },
//   { value: 'active', label: 'Active' },
//   { value: 'inactive', label: 'Inactive' },
// ];

const headers = [
  { id: 1, key: 'sNo', title: 'S.No' },
  { id: 2, key: 'promoCode', title: 'Promo Code' },
  { id: 3, key: 'addedOn', title: 'Added On' },
  { id: 4, key: 'status', title: 'Status' },
  { id: 5, key: 'action', title: 'Action' },
];

// eslint-disable-next-line react-refresh/only-export-components
const PromoCodeManagement = ({ filters, setFilters, pagination }) => {
  const { showModal, closeModal } = useModalStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: promoCodesData,
    isLoading: isPromoCodesLoading,
    isError: isPromoCodesError,
    error: promoCodesError,
  } = useQuery({
    queryKey: ['promoCodes', pagination, filters],
    queryFn: () => GetPromoCodes(filters, pagination),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
    retry: 2,
  });

  const { mutateAsync: changeStatusMutation } = useMutation({
    mutationFn: (id) => ChangePromoCodeStatus(id),
    onSuccess: ({ message }) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message: message || 'Promo Code has been activated successfully!',
          continueText: 'Okay',
          onContinue: () => {
            closeModal();
          },
        },
      });
      queryClient.invalidateQueries({ queryKey: ['promoCodes'] });
    },
    onError: (error) => {
      showToast(error?.message || 'Promo Code status change failed', 'error');
    },
  });

  const handleChangeStatus = (id, status) => {
    const title =
      status == 1 ? 'Deactivate Promo Code?' : 'Activate Promo Code?';
    const message =
      status == 1
        ? 'Are you sure you want to deactivate the Promo Code?'
        : 'Are you sure you want to activate the Promo Code?';
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
    <div className="promoCodeManagementScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle title="Promo Code Management" />
        </div>
        <div className="col-12 col-xl-6 text-end">
          <CustomButton
            text="Add Promo Code"
            to={'/promo-code-management/add-promo-code'}
            className="w-auto d-inline-block"
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
                        title: 'Registration Date',
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
                    pagination={promoCodesData?.meta}
                  >
                    <CustomTable
                      headers={headers}
                      loading={isPromoCodesLoading}
                      rows={filters.per_page}
                    >
                      <tbody>
                        {isPromoCodesError ||
                          (promoCodesData?.data?.length == 0 && (
                            <tr>
                              <td
                                colSpan={headers.length}
                                className="text-center"
                              >
                                {promoCodesError?.message || 'No data found'}
                              </td>
                            </tr>
                          ))}
                        {promoCodesData?.data?.map((promoCode, index) => (
                          <tr key={promoCode.id}>
                            <td>
                              {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </td>
                            <td>{promoCode?.promo_code}</td>
                            <td>{dateFormat(promoCode?.created_at)}</td>
                            <td>
                              <StatusDropdown
                                selected={
                                  promoCode?.status == 0
                                    ? { value: 0, label: 'Deactivate' }
                                    : promoCode?.status == 1
                                    ? { value: 1, label: 'Activate' }
                                    : { value: 2, label: 'Pending' }
                                }
                                options={[
                                  {
                                    value: promoCode?.status == 1 ? 0 : 1,
                                    label:
                                      promoCode?.status == 1
                                        ? 'Deactivate'
                                        : 'Activate',
                                    onClick: () => {
                                      handleChangeStatus(
                                        promoCode?.id,
                                        promoCode?.status
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
                                        `/promo-code-management/promo-code-details/${promoCode?.id}`
                                      );
                                    },
                                  },
                                  {
                                    icon: <LuPencil />,
                                    label: 'Edit',
                                    onClick: () => {
                                      navigate(
                                        `/promo-code-management/edit-promo-code/${promoCode?.id}`
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
export default withFilters(PromoCodeManagement);
