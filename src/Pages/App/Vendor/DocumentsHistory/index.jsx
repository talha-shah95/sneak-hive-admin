import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import GetDocumentsHistory from './Services/GetDocumentsHistory';

import withFilters from '../../../../HOC/withFilters ';
import { dateFormat } from '../../../../Utils/Utils';

import { LuEye } from 'react-icons/lu';

import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomTable from '../../../../Components/CustomTable';
import CustomTableActionDropdown from '../../../../Components/CustomTableActionDropdown';
import CustomFilters from '../../../../Components/CustomFilters';

const headers = [
  { id: 1, key: 'sNo', title: 'S.No' },
  { id: 2, key: 'uploadedDate', title: 'Uploaded Date' },
  { id: 3, key: 'verificationDate', title: 'Verification Date' },
  { id: 4, key: 'expiryDate', title: 'Expiry Date' },
  { id: 4, key: 'status', title: 'Status' },
  { id: 5, key: 'action', title: 'Action' },
];

// eslint-disable-next-line react-refresh/only-export-components
const DocumentsHistory = ({ filters, setFilters, pagination }) => {
  const navigate = useNavigate();

  const {
    data: documentsHistoryData,
    isLoading: isDocumentsHistoryLoading,
    isError: isDocumentsHistoryError,
    error: documentsHistoryError,
  } = useQuery({
    queryKey: ['documentsHistory', pagination, filters],
    queryFn: () => GetDocumentsHistory(filters, pagination),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
    retry: 2,
  });

  return (
    <div className="documentsHistoryScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle title="Documents History" />
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
                    pagination={documentsHistoryData?.meta}
                  >
                    <CustomTable
                      headers={headers}
                      loading={isDocumentsHistoryLoading}
                      rows={filters.per_page}
                    >
                      <tbody>
                        {isDocumentsHistoryError ||
                          (documentsHistoryData?.data?.length == 0 && (
                            <tr>
                              <td
                                colSpan={headers.length}
                                className="text-center"
                              >
                                {documentsHistoryError?.message ||
                                  'No data found'}
                              </td>
                            </tr>
                          ))}
                        {documentsHistoryData?.data?.map((document, index) => (
                          <tr key={index}>
                            <td>
                              {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </td>
                            <td>{dateFormat(document?.created_at) || 'N/A'}</td>
                            <td>
                              {dateFormat(document?.verification_date) || 'N/A'}
                            </td>
                            <td>
                              {dateFormat(document?.expiration_date) || 'N/A'}
                            </td>
                            <td
                              className={`text-capitalize ${
                                document?.status == 0
                                  ? 'colorYellowDark'
                                  : document?.status == 1
                                  ? 'colorGreen'
                                  : 'colorRed'
                              }`}
                            >
                              {document?.status_detail}
                            </td>
                            <td>
                              <CustomTableActionDropdown
                                actions={[
                                  {
                                    icon: <LuEye />,
                                    label: 'View',
                                    onClick: () => {
                                      navigate(
                                        `/documents-history/document-details/${document?.id}`
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
export default withFilters(DocumentsHistory);
