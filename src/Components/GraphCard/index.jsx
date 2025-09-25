import React from 'react';
import CustomCard from '../CustomCard';
import './style.css';

const GraphCard = ({ title, children }) => {
  return (
    <CustomCard className="graphCard">
      <div className="graphCard__header">
        <h3 className="graphCard__title">{title}</h3>
      </div>
      <div className="graphCard__content">{children}</div>
    </CustomCard>
  );
};

export default GraphCard;
