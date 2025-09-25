import React from 'react';
import './style.css';

const CustomCard = ({ title, children }) => {
  return (
    <div className="customCard">
      <div className="customCardBody">
        {title && (
          <div className="mb-3">
            <h3 className="customCardTitle">{title}</h3>
          </div>
        )}
        <div className="customCardContent">{children}</div>
      </div>
    </div>
  );
};

export default CustomCard;
