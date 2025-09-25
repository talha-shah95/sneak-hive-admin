import { PulseLoader } from 'react-spinners';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const CustomButton = ({
  style,
  type = 'button',
  variant = 'primary',
  wrapperClassName = '',
  className = '',
  disabled,
  onClick,
  text,
  children,
  loading,
  to,
  replace = false,
  state,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const commonProps = {
    className: `customButton ${variant} ${className} ${
      disabled ? 'disabled' : ''
    }`,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    style: { cursor: disabled ? 'not-allowed' : 'pointer' },
  };

  const content = loading ? (
    <PulseLoader
      size={8}
      color={
        disabled
          ? 'var(--grayColorDark)'
          : isHovered || isFocused
          ? 'var(--primaryColor)'
          : 'var(--whiteColor)'
      }
      style={{ height: 21 }}
    />
  ) : (
    text || children
  );

  return (
    <div style={{ ...style }} className={wrapperClassName}>
      {to ? (
        <Link
          to={to}
          replace={replace}
          state={state}
          {...commonProps}
          onClick={!disabled && onClick}
          tabIndex={disabled ? -1 : undefined}
          aria-disabled={disabled}
        >
          {content}
        </Link>
      ) : (
        <button
          type={type}
          {...commonProps}
          onClick={onClick}
          disabled={disabled}
        >
          {content}
        </button>
      )}
    </div>
  );
};

export default CustomButton;
