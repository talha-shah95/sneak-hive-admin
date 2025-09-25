import React from 'react';

import './style.css';
import LineSkeleton from '../SkeletonLoaders/LineSkeleton';

const CustomTable = ({
  className,
  headers,
  children,
  loading = false,
  rows = 10,
}) => {
  return (
    <div className={`customTable position-relative ${className}`}>
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => {
              if (typeof header == 'string') {
                return <th key={index}>{header}</th>;
              } else if (typeof header == 'object' && header !== null) {
                return <th key={index}>{header.title}</th>;
              } else {
                return <th key={index}>{header}</th>;
              }
            })}
          </tr>
        </thead>
        {loading ? (
          <tbody>
            {rows &&
              Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: headers.length }).map((_, colIndex) => (
                    <td key={colIndex} className="text-center">
                      <LineSkeleton height="100%" />
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        ) : (
          children
        )}
      </table>
    </div>
  );
};

export default CustomTable;
