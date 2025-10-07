import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// import { images } from '../../../../assets/images';

import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import StatCard from './Components/StatCard';
// import CustomSelect from '../../../Components/CustomSelect';
import LineSkeleton from '../../../../Components/SkeletonLoaders/LineSkeleton';

import TotalClicksGraph from './Components/TotalClicksGraph';
// import TotalOrdersGraph from './Components/TotalOrdersGraph';

import getProductStats from './Services/GetProductStats';

import './style.css';

// const timePeriods = [
//   { value: 'yearly', label: 'Yearly' },
//   { value: 'six_months', label: '6 Months' },
//   { value: 'monthly', label: 'Monthly' },
// ];

const ProductStats = () => {
  const { id } = useParams();
  //   const [selectedTimePeriod, setSelectedTimePeriod] = useState(
  //     timePeriods[0].value
  //   );

  const {
    data: productStatsData,
    isLoading: isProductStatsLoading,
    isError: isProductStatsError,
    error: productStatsError,
  } = useQuery({
    queryKey: ['productStats', id],
    queryFn: () => getProductStats(id),
    staleTime: 1000 * 60 * 5,
    enabled: true,
    retry: 2,
  });

  //   const handleTimePeriodChange = (e) => {
  //     const newPeriod = e.target.value;
  //     setSelectedTimePeriod(newPeriod);
  //   };

  return (
    <div className="dashboardScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle
            title="View Product Stats"
            backButton={true}
            backLink={'/product-management'}
          />
        </div>
      </div>

      <div className="statCards row mb-4">
        <div className="col-12 col-md-6 col-xl-4 mb-3 mb-xl-0">
          {isProductStatsError ? (
            <p className="text-danger">{productStatsError}</p>
          ) : (
            <StatCard
              title="Total Clicks On Product"
              value={productStatsData?.total_clicks || '0'}
              loading={isProductStatsLoading}
            />
          )}
        </div>
        {/* <div className="col-12 col-md-6 col-xl-4 mb-3 mb-xl-0">
            {isProductStatsError ? (
            <p className="text-danger">{productStatsError}</p>
          ) : (
            <StatCard
              title="Total Orders"
              value={productStatsData?.total_orders || '0'}
              icon={images.statsOrders}
              loading={isProductStatsLoading}
            />
          )}
        </div> */}
      </div>

      <div className="graphCards row mb-4">
        <div className="col-12">
          <CustomCard>
            <div className="graphTitle">
              <h3 className="graphCardTitle mb-4">Total Clicks On Product</h3>
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
            {isProductStatsLoading ? (
              <div className="text-center py-4">
                <LineSkeleton lines={6} />
              </div>
            ) : isProductStatsError ? (
              <div className="text-center py-4 text-danger">
                {productStatsError || 'Error loading data. Please try again.'}
              </div>
            ) : (
              <TotalClicksGraph
                clicksData={productStatsData.monthly_clicks || []}
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

export default ProductStats;
