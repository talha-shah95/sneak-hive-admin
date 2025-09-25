import React from 'react';

import { Dropdown } from 'react-bootstrap';

import { HiDotsVertical } from 'react-icons/hi';

import './style.css';

const CustomTableActionDropdown = ({ actions }) => {
  return (
    <Dropdown className="customTableActionDropdown">
      <Dropdown.Toggle>
        <HiDotsVertical size={20} />
      </Dropdown.Toggle>
      <Dropdown.Menu className="customTableActionDropdownMenu">
        {actions && actions.map((action, index) => (
          <Dropdown.Item
            key={index}
            onClick={action.onClick}
            className="customTableActionDropdownItem"
          >
            <div className="d-flex align-items-center gap-2">
              {action?.icon && action?.icon}
              <p className="flex-shrink-0">{action.label}</p>
            </div>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CustomTableActionDropdown;
