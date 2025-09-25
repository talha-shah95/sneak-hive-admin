import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import GetNewFeaturePlans from './Services/GetNewFeaturePlans';

import withFilters from '../../../../../HOC/withFilters ';

import PageTitle from '../../../../../Components/PageTitle';
import CustomCard from '../../../../../Components/CustomCard';
import CustomTable from '../../../../../Components/CustomTable';
import CustomFilters from '../../../../../Components/CustomFilters';
import CustomTableActionDropdown from '../../../../../Components/CustomTableActionDropdown';

import { LuEye } from 'react-icons/lu';

const headers = [
  { id: 1, key: 'sNo', title: 'S.No' },
  { id: 2, key: 'featurePlanTitle', title: 'Feature Plan Title' },
  { id: 3, key: 'duration', title: 'Duration' },
  { id: 4, key: 'amount', title: 'Amount' },
  { id: 5, key: 'action', title: 'Action' },
];

// eslint-disable-next-line react-refresh/only-export-components
const BuyFeaturePlan = ({ filters, setFilters, pagination }) => {
  const navigate = useNavigate();
  const {
    data: newFeaturePlansData,
    isLoading: isNewFeaturePlansLoading,
    isError: isNewFeaturePlansError,
    error: newFeaturePlansError,
  } = useQuery({
    queryKey: ['newFeaturePlans', pagination, filters],
    queryFn: () => GetNewFeaturePlans(filters, pagination),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
    retry: 2,
  });

  return (
    <div className="featurePlanManagementScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title=" Buy New Feature Plan"
            backButton
            backLink="/feature-plan-management"
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
                    // filters={filters}
                    sorting={[
                      { value: 5, label: '5' },
                      { value: 10, label: '10' },
                      { value: 25, label: '25' },
                      { value: 50, label: '50' },
                    ]}
                    search={false}
                    // dateFilters={[
                    //   {
                    //     title: 'Upload Date',
                    //     from: 'from',
                    //     to: 'to',
                    //   },
                    // ]}
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
                    pagination={newFeaturePlansData?.meta}
                  >
                    <CustomTable
                      headers={headers}
                      loading={isNewFeaturePlansLoading}
                      rows={filters.per_page}
                    >
                      <tbody>
                        {isNewFeaturePlansError ||
                          (newFeaturePlansData?.data?.length == 0 && (
                            <tr>
                              <td
                                colSpan={headers?.length}
                                className="text-center"
                              >
                                {newFeaturePlansError?.message ||
                                  'No data found'}
                              </td>
                            </tr>
                          ))}
                        {newFeaturePlansData?.data?.map(
                          (newFeaturePlan, index) => (
                            <tr key={index}>
                              <td>
                                {index + 1 < 10 ? `0${index + 1}` : index + 1}
                              </td>
                              <td>{newFeaturePlan?.title || '-'}</td>
                              <td>{newFeaturePlan?.duration || '-'}</td>
                              <td>${newFeaturePlan?.amount || '0'}</td>
                              <td>
                                <CustomTableActionDropdown
                                  actions={[
                                    {
                                      icon: <LuEye />,
                                      label: 'View',
                                      onClick: () => {
                                        navigate(
                                          `/feature-plan-management/new-feature-plan-details/${newFeaturePlan?.id}`
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
export default withFilters(BuyFeaturePlan);
