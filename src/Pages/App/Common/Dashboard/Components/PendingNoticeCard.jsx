import React from 'react';

import CustomCard from '../../../../../Components/CustomCard';
import CustomButton from '../../../../../Components/CustomButton';

const PendingNoticeCard = () => {
  return (
    <CustomCard>
      <div className="row align-items-center">
        <div className="col-12 col-md-6">
          <p className="colorBlue fw-semibold text-decoration-underline">
            Need help? View compliance support center.
          </p>
        </div>
        <div className="col-12 col-md-6 text-end">
          <CustomButton
            text="View documents"
            className="colorPrimary w-auto d-inline-block"
            to={'/'}
          />
        </div>
      </div>
    </CustomCard>
  );
};

export default PendingNoticeCard;
