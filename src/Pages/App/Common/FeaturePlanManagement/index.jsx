import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import GetFeaturePlans from './Services/GetFeaturePlans';

import withFilters from '../../../../HOC/withFilters ';
import { dateFormat } from '../../../../Utils/Utils';

import useModalStore from '../../../../Store/ModalStore';

import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomTable from '../../../../Components/CustomTable';
import CustomFilters from '../../../../Components/CustomFilters';
import CustomButton from '../../../../Components/CustomButton';

const headers = [
  { id: 1, key: 'sNo', title: 'S.No' },
  { id: 2, key: 'shopFeaturePlanTitle', title: 'Shop Feature Plan Title' },
  { id: 3, key: 'duration', title: 'Duration' },
  { id: 4, key: 'amount', title: 'Amount' },
  { id: 5, key: 'purchaseDate', title: 'Purchase Date' },
  { id: 6, key: 'expirationDate', title: 'Expiration Date' },
];

// eslint-disable-next-line react-refresh/only-export-components
const FeaturePlanManagement = ({ filters, setFilters, pagination }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  //get history from location
  // const history = location.state;
  const queryParams = new URLSearchParams(location.search);
  const paymentSuccess = queryParams.get('success');
  const { showModal, closeModal } = useModalStore();

  const [modalShown, setModalShown] = useState(false);

  useEffect(() => {
    if (paymentSuccess == 'true' && !modalShown) {
      showModal({
        type: 'success',
        modalProps: {
          hideClose: true,
          title: 'Successful',
          message: 'Payment has been made successfully',
          continueText: 'Okay',
          onContinue: async () => {
            closeModal();
            showModal({
              type: 'success',
              modalProps: {
                hideClose: true,
                title: 'Your Feature Plan is Active!',
                continueText: 'Go to My Dashboard',
                children: (
                  <div className="text14 colorGrayDark mt-4">
                    <p>
                      Thank you for purchasing a Feature Plan. Your shop is now
                      set to appear in featured listings and gain more
                      visibility.
                    </p>
                    <p>What happens next?</p>
                    <ul className="text14 colorGrayDark text-start">
                      <li>
                        Your shop will start showing in featured placements
                        within [X] minutes.
                      </li>
                      <li>
                        You can track your feature performance anytime in My
                        Dashboard &gt; Feature Plan.
                      </li>
                      <li>
                        You'll receive an email confirmation with all the
                        details.
                      </li>
                    </ul>
                    <p>
                      Tip: Update your shop profile and images to make the most
                      of your featured placement!
                    </p>
                    <CustomButton
                      text="Go to My Dashboard"
                      wrapperClassName="mt-4"
                      onClick={() => {
                        queryClient.invalidateQueries({
                          queryKey: ['featurePlans'],
                        });
                        closeModal();
                        navigate('/feature-plan-management');
                      }}
                    />
                  </div>
                ),
              },
            });
          },
        },
      });
      setModalShown(true);
    } else if (paymentSuccess == 'failed' && !modalShown) {
      showModal({
        type: 'question',
        modalProps: {
          title: 'Unsuccessful',
          message: 'Payment was Unsuccessful. \n Please try again.',
          continueText: 'Okay',
          onContinue: async () => {
            queryClient.invalidateQueries({ queryKey: ['featurePlans'] });
            closeModal();
            navigate('/feature-plan-management');
          },
        },
      });
      setModalShown(true);
    }
  }, [paymentSuccess, modalShown, showModal, closeModal, queryClient, navigate]);

  const {
    data: featurePlanData,
    isLoading: isFeaturePlanLoading,
    isError: isFeaturePlanError,
    error: featurePlanError,
  } = useQuery({
    queryKey: ['featurePlans', pagination, filters],
    queryFn: () => GetFeaturePlans(filters, pagination),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
    retry: 2,
  });

  return (
    <div className="featurePlanManagementScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle title="Feature Plan Management" />
        </div>
        <div className="col-12 col-xl-6 text-end">
          <CustomButton
            text="buy New Feature Plan"
            to={'/feature-plan-management/buy-feature-plan'}
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
                    pagination={featurePlanData?.meta}
                  >
                    <CustomTable
                      headers={headers}
                      loading={isFeaturePlanLoading}
                      rows={filters.per_page}
                    >
                      <tbody>
                        {isFeaturePlanError ||
                          (featurePlanData?.data?.length == 0 && (
                            <tr>
                              <td
                                colSpan={headers?.length}
                                className="text-center"
                              >
                                {featurePlanError?.message || 'No data found'}
                              </td>
                            </tr>
                          ))}
                        {featurePlanData?.data?.map((featurePlan, index) => (
                          <tr key={index}>
                            <td>
                              {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </td>
                            <td>{featurePlan?.plan?.title || '-'}</td>
                            <td>{featurePlan?.plan?.duration || '-'}</td>
                            <td>${featurePlan?.amount_paid || '0'}</td>
                            <td>
                              {dateFormat(featurePlan?.created_at) || '-'}
                            </td>
                            <td>
                              {dateFormat(featurePlan?.expiry_date) || '-'}
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
export default withFilters(FeaturePlanManagement);
