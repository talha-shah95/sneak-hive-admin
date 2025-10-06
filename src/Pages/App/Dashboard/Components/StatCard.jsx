import CustomCard from '../../../../Components/CustomCard';
import LineSkeleton from '../../../../Components/SkeletonLoaders/LineSkeleton';

const StatCard = ({ title, value, icon, loading }) => {
  return (
    <CustomCard>
      <div className="d-flex align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="statContent flex-grow-1">
            <p className="colorSecondary text-uppercase">{title}</p>
            <div className="statContentCount d-flex align-items-baseline gap-1">
              {loading ? (
                <LineSkeleton lines={1} height="14px" width="60px" />
              ) : (
                value
              )}
            </div>
          </div>
        </div>

        <div className="statImage flex-shrink-0">
          <img src={icon} alt="statsEarning" />
        </div>
      </div>
    </CustomCard>
  );
};

export default StatCard;
