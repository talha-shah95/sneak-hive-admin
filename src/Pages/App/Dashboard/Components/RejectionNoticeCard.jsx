import React from 'react';

import CustomCard from '../../../../Components/CustomCard';

const RejectionNoticeCard = ({ reason }) => {
  return (
    <CustomCard>
      <div className="row align-items-center">
        <div className="col-12 col-md-6">
          <p className="textLabel">Rejection Reason:</p>
          <p className="textValue">
            {reason ||
              'We regret to inform you that we are unable to proceed with your request at this time due to scheduling conflicts. Our availability does not align with the proposed timing, and we want to ensure...'}
          </p>
        </div>
        <div className="col-12 col-md-6"></div>
      </div>
    </CustomCard>
  );
};

export default RejectionNoticeCard;
