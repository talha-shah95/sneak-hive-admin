import CustomCard from '../../../../../Components/CustomCard';
import LineSkeleton from '../../../../../Components/SkeletonLoaders/LineSkeleton';

import { images } from '../../../../../assets/images';

import { IoArrowUpOutline } from 'react-icons/io5';

const StatCard = ({ title, value, icon, loading }) => {
  return (
    <CustomCard>
      <div className="d-flex align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="statImage flex-shrink-0">
            <img src={icon} alt="statsEarning" />
          </div>
          <div className="statContent flex-grow-1">
            <div className="statContentCount d-flex align-items-baseline gap-1">
              {loading ? (
                <LineSkeleton lines={1} height="14px" width="60px" />
              ) : (
                value
              )}
            </div>
            <p className="colorSecondary">{title}</p>
          </div>
        </div>

        <div className="statGraph flex-shrink-0">
          <img src={images.statsGraph} alt="statsGraph" />
        </div>
      </div>
    </CustomCard>
  );
};

export default StatCard;
