import React, { useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import './style.css';

const PageTitle = ({ title, backButton, backLink }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleGoBack = () => {
    if (backLink) {
      navigate(backLink);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="pageTitleContainer d-flex align-items-center gap-1 mb-2">
      {backButton && (
        <button
          className="backButton notButton"
          onClick={handleGoBack}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <LuArrowLeft
            style={{
              color: isHovered ? 'var(--primaryColor)' : 'var(--blackColor)',
            }}
            size={24}
          />
        </button>
      )}
      <h1 className="pageTitle">{title}</h1>
    </div>
  );
};

export default PageTitle;
