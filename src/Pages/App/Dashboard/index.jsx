import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { images } from '../../../assets/images';

import PageTitle from '../../../Components/PageTitle';
import CustomCard from '../../../Components/CustomCard';
import CustomSelect from '../../../Components/CustomSelect';
import LineSkeleton from '../../../Components/SkeletonLoaders/LineSkeleton';

import useUserStore from '../../../Store/UserStore';

import StatCard from './Components/StatCard';
import PendingNoticeCard from './Components/PendingNoticeCard';
import RejectionNoticeCard from './Components/RejectionNoticeCard';
import ReminderNoticeCard from './Components/ReminderNoticeCard';
import TotalEarningGraph from './Components/TotalEarningGraph';
import TotalOrdersGraph from './Components/TotalOrdersGraph';

import getStats from './Services/GetStats';
import getEarnings from './Services/GetEarnings';
import getOrders from './Services/GetOrders';

import './style.css';

const timePeriods = [
  { value: 'yearly', label: 'Yearly' },
  { value: 'six_months', label: '6 Months' },
  { value: 'monthly', label: 'Monthly' },
];

const Dashboard = () => {
  const { user } = useUserStore();

  const [selectedEarningPeriod, setSelectedEarningPeriod] = useState(
    timePeriods[0].value
  );

  const [selectedOrderPeriod, setSelectedOrderPeriod] = useState(
    timePeriods[0].value
  );

  const {
    data: statsData,
    isLoading: isStatsLoading,
    isError: isStatsError,
    error: statsError,
  } = useQuery({
    queryKey: ['stats'],
    queryFn: () => getStats(),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  const {
    data: earningsData,
    isLoading: isEarningLoading,
    isError: isEarningError,
    error: earningsError,
    refetch: refetchEarnings,
  } = useQuery({
    queryKey: ['earnings', selectedEarningPeriod],
    queryFn: () =>
      getEarnings({
        type: selectedEarningPeriod,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
    retry: 2,
  });

  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    error: ordersError,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ['orders', selectedOrderPeriod],
    queryFn: () =>
      getOrders({
        type: selectedOrderPeriod,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
    retry: 2,
  });

  const handleEarningPeriodChange = (e) => {
    const newPeriod = e.target.value;
    setSelectedEarningPeriod(newPeriod);
  };

  const handleOrdersPeriodChange = (e) => {
    const newPeriod = e.target.value;
    setSelectedOrderPeriod(newPeriod);
  };

  useEffect(() => {
    refetchEarnings({
      type: selectedEarningPeriod,
    });
  }, [refetchEarnings, selectedEarningPeriod]);

  useEffect(() => {
    refetchOrders({
      type: selectedOrderPeriod,
    });
  }, [refetchOrders, selectedOrderPeriod]);

  return (
    <div className="dashboardScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle title="Dashboard" />
        </div>
        <div className="col-12 col-xl-6 text-end">
          <p className="colorGrayDark">
            Status:{' '}
            <span
              className={`colorPrimary fw-semibold text-decoration-underline text-capitalize ${
                user?.business_profile?.status == 0
                  ? 'colorYellowDark'
                  : user?.business_profile?.status == 1
                  ? 'colorBlue'
                  : 'colorRed'
              }`}
            >
              {user?.business_profile?.status_detail}
            </span>
          </p>
          {user?.business_profile?.status == 1 ||
            (user?.business_profile?.status == 2 && (
              <p className="colorGrayDark">
                Expiration Date:{' '}
                <span className="colorBlack fw-semibold">
                  {user?.business_profile?.license?.expiration_date}
                </span>
              </p>
            ))}
        </div>
      </div>

      {user?.business_profile?.status == 0 && (
        <div className="noticeCard row mb-4">
          <div className="col-12">
            <PendingNoticeCard />
          </div>
        </div>
      )}
      {user?.business_profile?.status == 2 && (
        <div className="noticeCard row mb-4">
          <div className="col-12">
            <RejectionNoticeCard
              reason={user?.business_profile?.rejection_reason}
            />
          </div>
        </div>
      )}
      {user?.business_profile?.status == 1 && (
        <div className="noticeCard row mb-4">
          <div className="col-12">
            <ReminderNoticeCard reminder={user?.business_profile?.reminder} />
          </div>
        </div>
      )}

      <div className="statCards row mb-4">
        <div className="col-12 col-xl-6 mb-3 mb-xl-0">
          {isStatsError ? (
            <p className="text-danger">{statsError}</p>
          ) : (
            <StatCard
              title="Total Earning"
              value={statsData?.total_earnings || '0'}
              icon={images.statsEarning}
              loading={isStatsLoading}
            />
          )}
        </div>
        <div className="col-12 col-xl-6 mb-3 mb-xl-0">
          {isStatsError ? (
            <p className="text-danger">{statsError}</p>
          ) : (
            <StatCard
              title="Total Orders"
              value={statsData?.total_orders || '0'}
              icon={images.statsOrders}
              loading={isStatsLoading}
            />
          )}
        </div>
      </div>

      <div className="graphCards row mb-4">
        <div className="col-12">
          <CustomCard title="Total Earning">
            <div className="d-flex justify-content-end gap-3 mb-3">
              <CustomSelect
                name="earningPeriod"
                options={timePeriods}
                onChange={handleEarningPeriodChange}
                value={selectedEarningPeriod}
                className="me-2"
              />
            </div>
            {isEarningLoading ? (
              <div className="text-center py-4">
                <LineSkeleton lines={6} />
              </div>
            ) : isEarningError ? (
              <div className="text-center py-4 text-danger">
                {earningsError || 'Error loading data. Please try again.'}
              </div>
            ) : (
              <TotalEarningGraph
                earningData={earningsData}
                xAxisLabel={
                  selectedEarningPeriod === 'yearly'
                    ? 'Years'
                    : selectedEarningPeriod === 'six_months'
                    ? '6 Months'
                    : `Months`
                }
              />
            )}
          </CustomCard>
        </div>
      </div>

      <div className="graphCards row mb-4">
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
      </div>
    </div>
  );
};

export default Dashboard;
