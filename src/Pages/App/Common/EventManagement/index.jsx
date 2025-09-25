import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import GetEvents from './Services/GetEvents';

import withFilters from '../../../../HOC/withFilters ';
import { dateFormat } from '../../../../Utils/Utils';
import { LuEye } from 'react-icons/lu';
import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomTable from '../../../../Components/CustomTable';
import CustomFilters from '../../../../Components/CustomFilters';
import CustomTableActionDropdown from '../../../../Components/CustomTableActionDropdown';
import CustomButton from '../../../../Components/CustomButton';

const headers = [
  { id: 1, key: 'sNo', title: 'S.No' },
  { id: 2, key: 'eventName', title: 'Event Name' },
  { id: 3, key: 'eventType', title: 'Event Type' },
  { id: 4, key: 'enrollmentPrice', title: 'Enrollment Price' },
  { id: 5, key: 'uploadDate', title: 'Upload Date' },
  { id: 6, key: 'action', title: 'Action' },
];

// eslint-disable-next-line react-refresh/only-export-components
const EventManagement = ({ filters, setFilters, pagination }) => {
  const navigate = useNavigate();
  const {
    data: eventManagementData,
    isLoading: isEventManagementLoading,
    isError: isEventManagementError,
    error: eventManagementError,
  } = useQuery({
    queryKey: ['events', pagination, filters],
    queryFn: () => GetEvents(filters, pagination),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
    retry: 2,
  });

  return (
    <div className="eventManagementScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle title="Event Management" />
        </div>
        <div className="col-12 col-xl-6 text-end">
          <CustomButton
            text="Add Event"
            to={'/event-management/add-event'}
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
                    pagination={eventManagementData?.meta}
                  >
                    <CustomTable
                      headers={headers}
                      loading={isEventManagementLoading}
                      rows={filters.per_page}
                    >
                      <tbody>
                        {isEventManagementError ||
                          (eventManagementData?.data?.length == 0 && (
                            <tr>
                              <td
                                colSpan={headers?.length}
                                className="text-center"
                              >
                                {eventManagementError?.message ||
                                  'No data found'}
                              </td>
                            </tr>
                          ))}
                        {eventManagementData?.data?.map(
                          (eventManagement, index) => (
                            <tr key={index}>
                              <td>
                                {index + 1 < 10 ? `0${index + 1}` : index + 1}
                              </td>
                              <td>{eventManagement?.title || '-'}</td>
                              <td>{eventManagement?.event_type || '-'}</td>
                              <td>
                                {eventManagement?.enrollment_price || '-'}
                              </td>
                              <td>
                                {dateFormat(eventManagement?.created_at) || '-'}
                              </td>
                              <td>
                                <CustomTableActionDropdown
                                  actions={[
                                    {
                                      icon: <LuEye />,
                                      label: 'View',
                                      onClick: () => {
                                        navigate(
                                          `/event-management/event-details/${eventManagement?.id}`
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
export default withFilters(EventManagement);
