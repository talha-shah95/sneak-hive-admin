import React from 'react';

import CustomCard from '../../../../../Components/CustomCard';
import CustomToggleSwitch from '../../../../../Components/CustomToggle';

const ReminderNoticeCard = () => {
  return (
    <CustomCard>
      <div className="row align-items-center">
        <div className="col-12 col-md-6">
          <div className="d-flex gap-2">
            <p className="textValue">Reminder</p>
            <CustomToggleSwitch
              width={30}
              height={18}
              onChange={() => {}}
              checked={false}
            />
          </div>
          <p className="textLabel">Remind 30 days before expiry.</p>
        </div>
        <div className="col-12 col-md-6"></div>
      </div>
    </CustomCard>
  );
};

export default ReminderNoticeCard;
