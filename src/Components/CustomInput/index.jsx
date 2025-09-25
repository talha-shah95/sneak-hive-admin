import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import './style.css';

const CustomInput = ({
  label,
  labelClassName,
  id,
  name,
  required,
  error,
  type,
  placeholder,
  inputClassName,
  IconToBeUsed,
  IconToBeUsedLeft,
  value,
  maxLength,
  onChange,
  onBlur,
  readOnly,
  rows = 1,
  cols,
  eyeColor,
  direction,
  disabled,
  defaultValue,
  autoComplete = 'off',
  autoFocus,
  min,
  max,
  onButtonClick,
  rightText,
  iconColor,
  iconColorLeft,
  wrapperClassName,
}) => {
  const [typePass, setTypePass] = useState(true);

  const togglePassType = () => {
    setTypePass(!typePass);
  };
  return (
    <div className={`inputWrapper ${wrapperClassName ? wrapperClassName : ''}`}>
      {label && (
        <label htmlFor={id} className={labelClassName}>
          {label}
          {required ? <span className="text-danger">*</span> : ''}
        </label>
      )}
      {type === 'password' ? (
        <div className="d-flex align-items-center position-relative">
          {IconToBeUsedLeft && (
            <div className="left-icon">
              <IconToBeUsedLeft color={iconColorLeft || iconColor} />
            </div>
          )}
          <input
            type={typePass ? 'password' : 'text'}
            placeholder={placeholder}
            id={id}
            name={name}
            className={`mainInput passInput ${inputClassName} ${
              IconToBeUsedLeft ? 'paddingLeft' : ''
            } paddingRight`}
            value={value}
            onChange={(e) => {
              if (!maxLength || e.target.value.length <= maxLength) {
                onChange && onChange(e);
              }
            }}
            disabled={disabled}
            onBlur={onBlur}
            readOnly={readOnly}
            maxLength={maxLength}
          />
          <button type="button" className="right-icon" onClick={togglePassType}>
            {typePass ? (
              <FaRegEyeSlash
                color={eyeColor ? eyeColor : 'var(--primaryColor)'}
              />
            ) : (
              <FaRegEye color={eyeColor ? eyeColor : 'var(--primaryColor)'} />
            )}
          </button>
        </div>
      ) : type === 'textarea' ? (
        <textarea
          direction={direction}
          disabled={disabled}
          placeholder={placeholder}
          id={id}
          name={name}
          rows={rows}
          cols={cols}
          className={`mainInput ${inputClassName}`}
          onChange={(e) => {
            if (!maxLength || e.target.value.length <= maxLength) {
              onChange && onChange(e);
            }
          }}
          onBlur={onBlur}
          value={value}
          defaultValue={defaultValue}
          readOnly={readOnly}
          maxLength={maxLength}
        />
      ) : (
        <div className="d-flex align-items-center position-relative">
          {IconToBeUsedLeft && (
            <div className="left-icon">
              <IconToBeUsedLeft color={iconColorLeft || iconColor} />
            </div>
          )}
          <input
            dir={direction}
            disabled={disabled}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            id={id}
            name={name}
            className={`mainInput ${inputClassName} ${
              IconToBeUsed ? 'paddingRight' : ''
            } ${IconToBeUsedLeft ? 'paddingLeft' : ''}`}
            onChange={(e) => {
              if (!maxLength || e.target.value.length <= maxLength) {
                onChange && onChange(e);
              }
            }}
            onBlur={onBlur}
            value={value}
            defaultValue={defaultValue}
            min={
              type === 'date' || type === 'time' || type === 'number'
                ? min
                : undefined
            }
            max={
              type === 'date' || type === 'time' || type === 'number'
                ? max
                : undefined
            }
            readOnly={readOnly}
            maxLength={maxLength}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && onButtonClick) {
                onButtonClick();
              }
            }}
          />
          {IconToBeUsed ? (
            <div className="right-icon" onClick={onButtonClick}>
              <IconToBeUsed color={iconColor} />
            </div>
          ) : rightText ? (
            <div
              className="right-icon"
              style={{ fontSize: '12px' }}
              onClick={onButtonClick}
            >
              {rightText}
            </div>
          ) : null}
        </div>
      )}
      {error && <div className="input-error-message text-danger">{error}</div>}
    </div>
  );
};

export default CustomInput;
