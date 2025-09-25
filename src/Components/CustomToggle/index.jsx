import React from 'react';

import './style.css';

const CustomToggleSwitch = ({
  width = 100,
  height = 30,
  onChange,
  className = '',
  id,
  checked = false,
}) => {
  const handleChange = () => {
    if (onChange) {
      onChange();
    }
  };
  return (
    <label
      htmlFor={id}
      className={`customToggleSwitch ${className}`}
      style={{ width, height }}
      onClick={handleChange}
    >
      <input type="checkbox" id={id} checked={checked} className="d-none" />
      <div
        className={`customToggleSwitchCircle ${checked ? 'checked' : ''}`}
        style={{ height: height - 8 }}
      ></div>
      <div className="customToggleSwitchBg"></div>
    </label>
  );
};

export default CustomToggleSwitch;
