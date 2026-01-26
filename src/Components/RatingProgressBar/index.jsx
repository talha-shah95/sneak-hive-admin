import React from 'react';

import './style.css';

const RatingProgressBar = ({ rating, label, className = '' }) => {
    const width = (rating / 10) * 100;
    const ratingColor = rating > 8 ? 'bgGreen' : rating > 5.1 ? 'bgOrange' : 'bgRed';
    return (
        <div className="ratingProgressBarContainer">
            <div className={`ratingProgressBar ${className}`} >
                <div className="ratingProgressBarLabel">{label}</div>
                <div className={`ratingProgressBarFill ${ratingColor}`} style={{ width: `${width}%` }}></div>
            </div>
            <div className="ratingProgressBarValue">{rating}</div>
        </div>
    );
};

export default RatingProgressBar;
