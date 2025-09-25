import React from 'react';

import './style.css';

const CustomRadio = ({
  label,
  labelClassName = '',
  className = '',
  checked = false,
  onChange,
  name,
  value,
  id,
}) => {
  const handleRadioChange = (event) => {
    if (onChange) {
      onChange(event);
    }
  };
  return (
    <div className="customRadio">
      <label
        htmlFor={id}
        className={`customRadioLabel ${checked ? 'checked' : ''}`}
      ></label>
      <input
        className={className}
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={handleRadioChange}
        hidden
      />
      {label && (
        <label
          htmlFor={id}
          className={`customRadioLabelText ${labelClassName}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default CustomRadio;
