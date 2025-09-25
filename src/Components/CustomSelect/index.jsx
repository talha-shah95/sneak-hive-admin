import React, { forwardRef } from 'react';

import { FormSelect } from 'react-bootstrap';

import './style.css';

const CustomSelect = (
  {
    size = '',
    options = [],
    name,
    onChange,
    defaultValue,
    value,
    wrapperClassName = '',
    labelClassName = '',
    className = '',
    optionClassName = '',
    fullWidth,
    halfWidth,
    required,
    label,
    onBlur,
    disabled,
  },
  ref
) => {
  const handleSelectChange = (event) => {
    if (onChange) {
      onChange(event);
    }
  };

  const isDisable = (optionValue) => {
    if (optionValue == value) return true;
    else return false;
  };

  return (
    <div
      className={`customSelect ${fullWidth && 'fullWidth'} ${
        halfWidth && 'halfWidth'
      } ${wrapperClassName}`}
    >
      {label && (
        <label htmlFor={name} className={`${labelClassName}`}>
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      <FormSelect
        ref={ref}
        name={name}
        defaultValue={defaultValue}
        value={value}
        onChange={handleSelectChange}
        size={size}
        className={`${className}`}
        onBlur={onBlur}
        disabled={disabled}
      >
        {options?.map(({ value, label }, index) => (
          <option
            key={`${name}-${index}`}
            value={value}
            disabled={isDisable(value)}
            className={`${optionClassName} ${
              isDisable(value) ? 'disabled' : ''
            }`}
          >
            {label}
          </option>
        ))}
      </FormSelect>
    </div>
  );
};

export default forwardRef(CustomSelect);
