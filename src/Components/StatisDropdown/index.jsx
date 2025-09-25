import React, { useEffect, useState } from 'react';

import { Dropdown } from 'react-bootstrap';

// import { GoDotFill } from 'react-icons/go';

import './style.css';

const statusMap = [
  { value: 0, statusClass: 'statusRed' },
  { value: 1, statusClass: 'statusGreen' },
  { value: 2, statusClass: 'statusYellow' },
];

const StatusDropdown = ({
  selected,
  options,
  className = '',
  variant = 'secondary',
}) => {

  const [statusClass, setStatusClass] = useState(null);

  useEffect(() => {
    if (selected && statusMap) {
      const status = statusMap.find(
        (status) => status?.value === selected?.value
      );
      setStatusClass(status?.statusClass || 'statusRed');
    }
  }, [selected, statusMap]);

  return (
    <Dropdown className={`statusDropdown ${className}`}>
      <Dropdown.Toggle
        className={`statusDropdownToggle ${statusClass} ${variant}`}
        data-bs-toggle="dropdown"
      >
        <div className="d-flex align-items-center gap-1">
          {/* {variant === 'primary' && <GoDotFill size={8} />} */}
          <p className="flex-shrink-0">{selected?.label || '-'}</p>
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu className="statusDropdownMenu">
        {options &&
          options.map(
            (option, index) =>
              option?.value !== selected?.value && (
                <Dropdown.Item
                  key={index}
                  onClick={option?.onClick}
                  className="statusDropdownItem"
                >
                  <p className="flex-shrink-0">{option?.label || '-'}</p>
                </Dropdown.Item>
              )
          )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default StatusDropdown;
