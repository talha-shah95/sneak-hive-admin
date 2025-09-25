import React from 'react';
import { FaCheck } from 'react-icons/fa';
import './style.css';

const CustomCheckbox = ({
  label,
  checked,
  onChange,
  id,
  size = '16px',
  className = '',
}) => {
  return (
    <label
      className={`customCheckBoxContainer cursor-pointer ${className}`}
      htmlFor={id}
      onClick={onChange}
    >
      {/* <input type="checkbox" id={id} checked={checked} onChange={onChange} /> */}
      <div
        style={{ width: size, height: size }}
        className={`customCheckBox ${checked ? 'checked' : ''}`}
      >
        {checked && <FaCheck />}
      </div>
      {/* <span className="checkmark" /> */}
      {label && <span className="customCheckBoxLabel">{label}</span>}
    </label>
  );
};

export default CustomCheckbox;
