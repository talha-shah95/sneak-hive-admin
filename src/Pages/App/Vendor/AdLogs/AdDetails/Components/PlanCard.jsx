import React from 'react';

import './style.css';

const PlanCard = ({
  onChange,
  className = '',
  id,
  name,
  value,
  checked,
  duration,
  title,
  price,
}) => {
  const handleRadioChange = (event) => {
    if (onChange) {
      onChange(event);
    }
  };
  return (
    <label className="planCard">
      <div className="planCardTitleWrapper d-flex align-items-center gap-3 mb-3">
        {/* //Change radio button styling to primary color */}
        <input
          className={`${className} colorPrimary`}
          id={id}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={handleRadioChange}
          hidden
        />
        <label
          htmlFor={id}
          className={`colorPrimary ${checked ? 'colorRed' : ''}`}
        >
          <span className={`planCardMark ${checked ? 'checked' : ''}`}></span>
        </label>
        <p className="text18">{title}</p>
      </div>
      <div className="d-flex gap-5">
        <div>
          <p className="text14">Duration</p>
          <p className="text14 colorGrayDark">{duration}</p>
        </div>
        <div>
          <p className="text14">Price</p>
          <p className="text14 colorGrayDark">${price}</p>
        </div>
      </div>
    </label>
  );
};

export default PlanCard;
