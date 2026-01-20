import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { images } from '../../../assets/images';

import PageTitle from '../../../Components/PageTitle';
import CustomCard from '../../../Components/CustomCard';
// import CustomSelect from '../../../Components/CustomSelect';
import LineSkeleton from '../../../Components/SkeletonLoaders/LineSkeleton';

import StatCard from './Components/StatCard';

import TotalUsersGraph from './Components/TotalUsersGraph';
// import TotalOrdersGraph from './Components/TotalOrdersGraph';

import getDashboard from './Services/getDashboard';

import './style.css';

const timePeriods = [
  { value: 'yearly', label: 'Yearly' },
  { value: 'six_months', label: '6 Months' },
  { value: 'monthly', label: 'Monthly' },
];

const Dashboard = () => {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(
    timePeriods[0].value
  );

  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    error: dashboardError,
  } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getDashboard(),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  const handleTimePeriodChange = (e) => {
    const newPeriod = e.target.value;
    setSelectedTimePeriod(newPeriod);
  };

  return (
    <div className="dashboardScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle title="Dashboard" />
        </div>
      </div>

      <div className="statCards row mb-4">
        <div className="col-12 col-md-6 col-xl-4 mb-3 mb-xl-0">
          {isDashboardError ? (
            <p className="text-danger">{dashboardError}</p>
          ) : (
            <StatCard
              title="Total Users"
              value={dashboardData?.total_users || '0'}
              icon={images.statsUsers}
              loading={isDashboardLoading}
            />
          )}
        </div>
        {/* <div className="col-12 col-md-6 col-xl-4 mb-3 mb-xl-0">
          {isDashboardError ? (
            <p className="text-danger">{dashboardError}</p>
          ) : (
            <StatCard
              title="Total Orders"
              value={dashboardData?.total_orders || '0'}
              icon={images.statsOrders}
              loading={isDashboardLoading}
            />
          )}
        </div> */}
      </div>

      <div className="graphCards row mb-4">
        <div className="col-12">
          <CustomCard>
            <div className="graphTitle">
              <h3 className="graphCardTitle mb-4">Total Users</h3>
            </div>
            {/* <div className="d-flex justify-content-end gap-3 mb-3">
              <CustomSelect
                name="timePeriod"
                options={timePeriods}
                onChange={handleTimePeriodChange}
                value={selectedTimePeriod}
                className="me-2"
              />
            </div> */}
            {isDashboardLoading ? (
              <div className="text-center py-4">
                <LineSkeleton lines={6} />
              </div>
            ) : isDashboardError ? (
              <div className="text-center py-4 text-danger">
                {dashboardError || 'Error loading data. Please try again.'}
              </div>
            ) : (
              <TotalUsersGraph
                usersData={dashboardData.monthly_users}
                // xAxisLabel={
                //   selectedTimePeriod === 'yearly'
                //     ? 'Years'
                //     : selectedTimePeriod === 'six_months'
                //     ? '6 Months'
                //     : `Months`
                // }
                xAxisLabel="Months"
              />
            )}
          </CustomCard>
        </div>
      </div>

      {/* <div className="graphCards row mb-4">
        <div className="col-12">
          <CustomCard title="Total Orders">
            <div className="d-flex justify-content-end gap-3 mb-3">
              <CustomSelect
                name="ordersPeriod"
                options={timePeriods}
                onChange={handleOrdersPeriodChange}
                value={selectedOrderPeriod}
                className="me-2"
              />
            </div>
            {isOrdersLoading ? (
              <div className="text-center py-4">
                <LineSkeleton lines={6} />
              </div>
            ) : isOrdersError ? (
              <div className="text-center py-4 text-danger">
                {ordersError || 'Error loading data. Please try again.'}
              </div>
            ) : (
              <TotalOrdersGraph
                ordersData={ordersData}
                xAxisLabel={
                  selectedOrderPeriod === 'yearly'
                    ? 'Years'
                    : selectedOrderPeriod === 'six_months'
                    ? '6 Months'
                    : `Months`
                }
              />
            )}
          </CustomCard>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
