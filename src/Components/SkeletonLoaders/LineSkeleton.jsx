import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const LineSkeleton = ({
  lines = 1,
  height = '100%',
  width = '100%',
  gap = 8,
  borderRadius = 4,
}) => {
  return (
    <span
      style={{
        height: '100%',
        width: '100%',
        display: 'inline-flex',
        flexDirection: 'column',
        gap: `${gap}px`,
      }}
    >
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={width}
          height={height}
          borderRadius={borderRadius}
          style={{
            // Last line might be shorter if needed
            width: index === lines - 1 && lines > 1 ? '70%' : width,
          }}
        />
      ))}
    </span>
  );
};

export default LineSkeleton;
